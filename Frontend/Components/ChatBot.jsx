import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Bot, User, Loader2, Paperclip, Image, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as pdfjs from 'pdfjs-dist';

// Set worker path for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [botData, setBotData] = useState(null);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchBotData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chatbot/data');
        const data = await response.json();
        setBotData(data);
      } catch (error) {
        console.error('Error fetching bot data:', error);
      }
    };

    fetchBotData();
  }, []);

  useEffect(() => {
    // Add welcome message when chat opens
    setMessages([
      {
        role: "bot",
        content: `Hello! I can help you with:
        1. Blood availability (e.g., "Is A+ blood available?")
        2. Hospital information (e.g., "How many hospitals are there?")
        3. Donor statistics (e.g., "How many donors are registered?")
        4. Blood inventory (e.g., "Show blood group statistics")
        
        What would you like to know?`
      }
    ]);
  }, []);

  // Enhanced query processing function
  const processQuery = (query) => {
    if (!botData) return "Sorry, I'm still loading data.";

    query = query.toLowerCase();
    
    // Blood inventory queries with better matching
    if (query.includes('blood') || query.includes('inventory')) {
      // If specific blood type is requested
      const bloodTypeMatch = query.match(/\b(a|b|ab|o)[+-]\b/i);
      if (bloodTypeMatch) {
        const bloodType = bloodTypeMatch[0].toUpperCase();
        const inventoryKey = bloodType
          .replace(/^A\+$/, 'aPositive')
          .replace(/^A-$/, 'aNegative')
          .replace(/^B\+$/, 'bPositive')
          .replace(/^B-$/, 'bNegative')
          .replace(/^AB\+$/, 'abPositive')
          .replace(/^AB-$/, 'abNegative')
          .replace(/^O\+$/, 'oPositive')
          .replace(/^O-$/, 'oNegative');

        const units = botData.statistics.bloodInventory[inventoryKey] || 0;
        const status = units < 10 ? '🔴 Critical' : units < 20 ? '🟡 Moderate' : '🟢 Good';
        
        return `Blood Type: ${bloodType}
Available Units: ${units}
Status: ${status}

${units === 0 ? '⚠️ Not available!' : 
  units < 10 ? '⚠️ Critical: Running very low!' : 
  units < 20 ? '⚡ Moderate supply available' : 
  '✅ Good supply available'}

Need this blood type? Contact our nearest hospital or create an emergency request.`;
      }

      // Show all blood inventory
      const bloodGroups = [
        ['A+', 'aPositive'],
        ['A-', 'aNegative'],
        ['B+', 'bPositive'],
        ['B-', 'bNegative'],
        ['AB+', 'abPositive'],
        ['AB-', 'abNegative'],
        ['O+', 'oPositive'],
        ['O-', 'oNegative']
      ].map(([display, key]) => {
        const units = botData.statistics.bloodInventory[key] || 0;
        const status = units < 10 ? '🔴' : units < 20 ? '🟡' : '🟢';
        return `${status} ${display}: ${units} units`;
      }).join('\n');

      return `🏥 Current Blood Inventory Status:
${bloodGroups}

Status Indicators:
🟢 Good Supply (20+ units)
🟡 Moderate Supply (10-19 units)
🔴 Critical Supply (<10 units)`;
    }

    // Emergency-related queries
    if (query.includes('emergency') || query.includes('urgent')) {
      const activeEmergencies = botData.statistics.activeEmergencies;
      return `There are currently ${activeEmergencies} active emergency requests. Our average response time is ${botData.statistics.emergencyResponseTime}.`;
    }

    // Hospital rating queries
    if (query.includes('rating') || query.includes('review')) {
      const avgRating = botData.statistics.averageRating;
      return `The average hospital rating in our network is ${avgRating}/5 stars.`;
    }

    // City-specific queries
    const cities = Object.keys(botData.statistics.cityWiseDistribution);
    const mentionedCity = cities.find(city => query.includes(city.toLowerCase()));
    if (mentionedCity) {
      const hospitalCount = botData.statistics.cityWiseDistribution[mentionedCity];
      const cityHospitals = botData.hospitals.filter(h => 
        h.location.city.toLowerCase() === mentionedCity.toLowerCase()
      );
      return `There are ${hospitalCount} hospitals in ${mentionedCity}:\n${
        cityHospitals.map(h => `• ${h.name} (Rating: ${h.rating}⭐)`).join('\n')
      }`;
    }

    // Blood availability queries - Fixed inventory key mapping
    if (query.includes('blood') && (query.includes('available') || query.includes('have'))) {
      const bloodType = query.match(/(?:a|b|o|ab)[+-]/i)?.[0]?.toUpperCase();
      if (bloodType) {
        // Fix the inventory key mapping
        const inventoryKey = bloodType
          .replace(/A\+/, 'aPositive')
          .replace(/A-/, 'aNegative')
          .replace(/B\+/, 'bPositive')
          .replace(/B-/, 'bNegative')
          .replace(/AB\+/, 'abPositive')
          .replace(/AB-/, 'abNegative')
          .replace(/O\+/, 'oPositive')
          .replace(/O-/, 'oNegative');

        // Get the total units and format response
        const totalUnits = botData.statistics.bloodInventory[inventoryKey] || 0;
        const status = totalUnits < 10 ? '🔴 Critical' : totalUnits < 20 ? '🟡 Moderate' : '🟢 Good';
        
        return `Blood Type: ${bloodType}
Available Units: ${totalUnits}
Status: ${status}

${totalUnits < 10 ? '⚠️ Warning: This blood type is running low!' : 
  totalUnits > 50 ? '✅ Good supply available' : ''}`;
      }

      // If no specific blood type is mentioned, show all blood types
      return `Please specify a blood type (A+, A-, B+, B-, AB+, AB-, O+, O-).
Current inventory status:
${Object.entries(botData.statistics.bloodInventory)
  .map(([type, count]) => {
    const formattedType = type
      .replace('Positive', '+')
      .replace('Negative', '-')
      .replace(/^a/, 'A')
      .replace(/^b/, 'B')
      .replace(/^o/, 'O');
    return `${formattedType}: ${count} units`;
  })
  .join('\n')}`;
    }

    // Hospital queries with enhanced location search
    if (query.includes('hospital')) {
      if (query.includes('how many')) {
        return `There are ${botData.statistics.totalHospitals} hospitals registered in our system.`;
      }
      
      // Look for city mentions
      const cityMatch = botData.hospitals.filter(h => 
        query.includes(h.location.city.toLowerCase())
      );
      if (cityMatch.length > 0) {
        return `Found ${cityMatch.length} hospital(s) in ${cityMatch[0].location.city}:\n${
          cityMatch.map(h => `• ${h.name}`).join('\n')
        }`;
      }
    }

    // Users/Donors queries with more details
    if (query.includes('donor') || query.includes('user')) {
      const bloodGroupStats = {};
      botData.users.forEach(user => {
        bloodGroupStats[user.bloodGroup] = (bloodGroupStats[user.bloodGroup] || 0) + 1;
      });
      
      return `We have ${botData.statistics.totalUsers} registered donors in our system.
        \nDonor distribution by blood group:\n${
        Object.entries(bloodGroupStats)
          .map(([group, count]) => `${group}: ${count} donors`)
          .join('\n')
      }`;
    }

    // Enhanced blood statistics
    if (query.includes('blood') || query.includes('inventory')) {
      const bloodGroups = Object.entries(botData.statistics.bloodInventory)
        .map(([type, count]) => {
          const formattedType = type.replace('Positive', '+').replace('Negative', '-');
          const status = count < 10 ? '🔴 Critical' : count < 20 ? '🟡 Moderate' : '🟢 Good';
          return `${formattedType}: ${count} units ${status}`;
        })
        .join('\n');
      return `🏥 Blood Inventory Status:\n${bloodGroups}`;
    }

    // Natural language processing for general queries
    const keywords = query.split(' ');
    if (keywords.some(word => ['help', 'support', 'assistance'].includes(word))) {
      return `I can help you with:
      🩸 Blood availability
      🏥 Hospital information
      👥 Donor statistics
      🚨 Emergency requests
      ⭐ Hospital ratings
      
      Just ask me anything about these topics!`;
    }

    // Default response with suggestion buttons (implement in UI)
    return `I'm not sure about that. Here are some things you can ask me about:
    • Blood availability
    • Hospital information
    • Donor statistics
    • Emergency requests
    • Hospital ratings`;
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const analyzePdfContent = async (pdfText) => {
    // Blood donation eligibility criteria
    const criteria = {
      hemoglobin: { min: 12.5, max: 18 },
      bloodPressure: { 
        systolic: { min: 90, max: 180 },
        diastolic: { min: 60, max: 100 }
      },
      pulse: { min: 60, max: 100 },
      temperature: { min: 36.5, max: 37.5 },
      weight: { min: 50 },
      age: { min: 18, max: 65 }
    };

    // Extract values from PDF text using regex
    const extractValue = (text, pattern) => {
      const match = text.match(pattern);
      return match ? parseFloat(match[1]) : null;
    };

    const values = {
      hemoglobin: extractValue(pdfText, /hemoglobin[:\s]+(\d+\.?\d*)/i),
      systolic: extractValue(pdfText, /blood pressure[:\s]+(\d+)/i),
      diastolic: extractValue(pdfText, /blood pressure[:\s]+\d+\/(\d+)/i),
      pulse: extractValue(pdfText, /pulse[:\s]+(\d+)/i),
      temperature: extractValue(pdfText, /temperature[:\s]+(\d+\.?\d*)/i),
      weight: extractValue(pdfText, /weight[:\s]+(\d+\.?\d*)/i),
      age: extractValue(pdfText, /age[:\s]+(\d+)/i)
    };

    let eligibility = { status: true, reasons: [] };

    // Check each criterion
    if (values.hemoglobin < criteria.hemoglobin.min) {
      eligibility.status = false;
      eligibility.reasons.push(`Hemoglobin level (${values.hemoglobin}) is below minimum required (${criteria.hemoglobin.min})`);
    }

    if (values.systolic && (values.systolic < criteria.bloodPressure.systolic.min || 
        values.systolic > criteria.bloodPressure.systolic.max)) {
      eligibility.status = false;
      eligibility.reasons.push(`Blood pressure (systolic) is out of range`);
    }

    // Add more checks for other criteria...

    return {
      eligibility,
      values
    };
  };

  const validatePdfContent = (text) => {
    // Check for required fields in the blood report
    const requiredFields = [
      'hemoglobin',
      'blood pressure',
      'pulse',
      'weight',
      'age'
    ];

    const missingFields = requiredFields.filter(field => 
      !text.toLowerCase().includes(field)
    );

    if (missingFields.length > 0) {
      throw new Error(`Invalid blood report format. Missing required fields: ${missingFields.join(', ')}`);
    }

    return true;
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setLoading(true);
        
        try {
          // Check file size (max 5MB)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error('File size too large. Please upload a PDF smaller than 5MB.');
          }

          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          
          if (pdf.numPages > 10) {
            throw new Error('PDF has too many pages. Please upload a shorter report.');
          }

          let fullText = '';
          
          // Extract text from all pages with progress tracking
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }

          // Validate PDF content
          validatePdfContent(fullText);

          const analysis = await analyzePdfContent(fullText);
          
          // Add bot response with analysis
          const response = `📋 Blood Report Analysis:
${analysis.eligibility.status ? '✅ You are eligible to donate blood!' : '❌ You are currently not eligible to donate blood.'}

${analysis.eligibility.reasons.length > 0 ? '\nReasons:\n' + analysis.eligibility.reasons.join('\n') : ''}

📊 Your Values:
${Object.entries(analysis.values)
  .filter(([_, value]) => value !== null)
  .map(([key, value]) => `• ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
  .join('\n')}

${analysis.eligibility.status ? 
  '\nYou can proceed with blood donation! Visit your nearest blood bank.' : 
  '\nPlease consult with a healthcare provider for more information.'}`;

          setMessages(prev => [...prev, 
            { role: "user", content: "Analyzed blood report", attachment: { type: 'pdf', name: file.name } },
            { role: "bot", content: response }
          ]);
        } catch (error) {
          console.error('Error processing PDF:', error);
          setMessages(prev => [...prev, 
            { role: "bot", content: `⚠️ ${error.message || 'Could not read the PDF properly.'}
            
Please ensure:
• The file is a valid blood report
• Contains required medical information
• Is properly formatted
• Is not corrupted or password protected` }
          ]);
          setSelectedFile(null);
        } finally {
          setLoading(false);
        }
      } else if (file.type.startsWith('image/')) {
        setSelectedFile(file);
      } else {
        alert('Please upload only images or PDF files');
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedFile) return;

    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    const userMessage = {
      role: "user",
      content: input,
      attachment: selectedFile ? {
        type: selectedFile.type,
        name: selectedFile.name,
        url: URL.createObjectURL(selectedFile)
      } : null
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedFile(null);
    setLoading(true);

    try {
      // Handle file upload if present
      if (selectedFile) {
        // TODO: Implement file upload to your backend
        // const uploadResponse = await fetch('http://localhost:5000/api/chatbot/upload', {
        //   method: 'POST',
        //   body: formData
        // });
      }

      const response = processQuery(input);
      setMessages((prev) => [...prev, { role: "bot", content: response }]);
    } catch (error) {
      console.error("Error processing query:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong!" }]);
    }

    setLoading(false);
  };

  // Handle "Enter" Key Press to Send Message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {!isOpen ? (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
          onClick={toggleChat}
        >
          <MessageCircle size={24} />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-5 right-5 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="text-white" size={24} />
              <h2 className="text-lg font-semibold text-white">BloodBond Assistant</h2>
            </div>
            <X 
              className="text-white cursor-pointer hover:bg-blue-800 rounded p-1 transition-colors" 
              onClick={toggleChat} 
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-start max-w-[80%] space-x-2">
                  {msg.role === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bot size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-2xl ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <User size={20} className="text-white" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot size={20} className="text-blue-600" />
                </div>
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="bg-gray-100 p-3 rounded-full"
                >
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </motion.div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex flex-col space-y-2">
              {selectedFile && (
                <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                  {selectedFile.type.startsWith('image/') ? (
                    <Image size={20} className="text-blue-600" />
                  ) : (
                    <FileText size={20} className="text-blue-600" />
                  )}
                  <span className="text-sm truncate">{selectedFile.name}</span>
                  <X 
                    size={16} 
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => setSelectedFile(null)}
                  />
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="p-2 text-gray-500 hover:text-blue-600"
                  title="Attach file"
                >
                  <Paperclip size={20} />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-full focus:outline-none focus:border-blue-600 transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Chatbot;