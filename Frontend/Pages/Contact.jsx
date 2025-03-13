import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const Contact = () => {
  return (
    <section className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <div className="text-center py-16">
        <motion.h1
          className="text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Contact Us
        </motion.h1>
        <p className="text-lg max-w-2xl mx-auto">
          Need help or have questions? Get in touch with us anytime.
        </p>
      </div>

      {/* Contact Information & Form */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 px-6">
        {/* Left Side - Contact Info */}
        <motion.div
          className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>

          <div className="flex items-center">
            <MapPin className="text-[#fc4848] mr-3" size={24} />
            <p>123 BloodBond Street, Blood City, 45678</p>
          </div>

          <div className="flex items-center">
            <Mail className="text-[#fc4848] mr-3" size={24} />
            <p>support@blooddonation.com</p>
          </div>

          <div className="flex items-center">
            <Phone className="text-[#fc4848] mr-3" size={24} />
            <p>+123 456 7890</p>
          </div>

          {/* Social Media Links */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-[#fc4848] hover:text-black transition">
                Facebook
              </a>
              <a href="#" className="text-[#fc4848] hover:text-black transition">
                Twitter
              </a>
              <a href="#" className="text-[#fc4848] hover:text-black transition">
                Instagram
              </a>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Contact Form */}
        <motion.div
          className="bg-gray-100 p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-lg">Your Name</label>
              <input
                type="text"
                className="w-full p-3 mt-1 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:border-[#fc4848]"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-lg">Your Email</label>
              <input
                type="email"
                className="w-full p-3 mt-1 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:border-[#fc4848]"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label className="block text-lg">Your Message</label>
              <textarea
                rows="4"
                className="w-full p-3 mt-1 rounded-lg bg-white text-black border border-gray-300 focus:outline-none focus:border-[#fc4848]"
                placeholder="Type your message here..."
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-[#fc4848] hover:bg-black text-white py-3 mt-4 rounded-lg text-lg font-semibold transition flex items-center justify-center"
            >
              Send Message <Send className="ml-2" />
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Google Map */}
      <div className="mt-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-6">Find Us Here</h2>
        <motion.div
          className="w-full h-64 rounded-lg overflow-hidden shadow-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <iframe
            className="w-full h-full"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093666!2d144.95373531590413!3d-37.81627974202102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf4c34d27541dc9ff!2sBloodBond%20Blood%20Bank!5e0!3m2!1sen!2s!4v1646997748000!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>

      {/* Call to Action */}
      <motion.div
        className="text-center mt-16 py-12 bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">We Are Here to Help!</h2>
        <p className="mb-6">Reach out to us for any queries or assistance.</p>
        <a
          href="/signup"
          className="px-6 py-3 bg-[#fc4848] hover:bg-black text-white rounded-lg text-lg font-semibold transition"
        >
          Sign Up Now
        </a>
      </motion.div>
    </section>
  );
};

export default Contact;