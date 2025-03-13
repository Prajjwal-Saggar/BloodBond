import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Clock, Check, AlertCircle } from "lucide-react";

const EmergencySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const { bloodGroup, location: userLocation } = location.state || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Emergency Request Submitted
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            We have notified all nearby hospitals about your request for{" "}
            <span className="font-semibold text-red-600">{bloodGroup}</span> blood in{" "}
            <span className="font-semibold">{userLocation?.city}</span>
          </p>

          <div className="bg-red-50 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-red-600 mr-2" />
              <span className="text-2xl font-bold text-red-600">
                {formatTime(timeLeft)}
              </span>
            </div>
            <p className="text-gray-700">
              Hospitals will contact you within this time frame
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg flex items-start text-left">
            <AlertCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-blue-800 space-y-2">
                <li>✓ Nearby hospitals have been notified</li>
                <li>✓ They will check blood availability</li>
                <li>✓ You will receive calls from available hospitals</li>
                <li>✓ Coordinate with the hospital that contacts you first</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EmergencySuccess;
