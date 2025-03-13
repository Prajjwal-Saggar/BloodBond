import React from "react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import { Heart, HandHelping, Users, ShieldCheck, Star } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Navbar />

      {/* Hero Section with Animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-20 text-center p-6 max-w-3xl w-full"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          About Us
        </h1>
        <p className="text-lg text-gray-700">
          We are dedicated to saving lives through blood and organ donation. Our platform connects donors with those in need, ensuring a seamless and safe process.
        </p>
      </motion.div>

      {/* Mission & Vision */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6 mt-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Mission</h2>
          <p className="text-gray-700">
            To create a reliable and accessible network for blood and organ donation, making the process easy, safe, and efficient for donors and recipients.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-100 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Our Vision</h2>
          <p className="text-gray-700">
            To ensure no one suffers due to a lack of blood or organ availability by connecting heroes (donors) with those in need.
          </p>
        </motion.div>
      </div>

      {/* How It Works */}
      <div className="text-center mt-16 px-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <Heart className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Register as a Donor</h3>
            <p className="text-gray-700">
              Sign up and choose to donate blood or organs. Your registration can help save lives.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <HandHelping className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Find a Match</h3>
            <p className="text-gray-700">
              Our platform securely connects donors with those in need based on location and compatibility.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <ShieldCheck className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Safe & Secure Donation</h3>
            <p className="text-gray-700">
              We ensure a medically safe process, working with verified hospitals and professionals.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="text-center mt-16 px-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Choose Us?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <Users className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Trusted Community</h3>
            <p className="text-gray-700">
              Thousands of donors and hospitals rely on us for lifesaving connections.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <ShieldCheck className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure & Verified</h3>
            <p className="text-gray-700">
              We prioritize security, working only with accredited medical institutions.
            </p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <Heart className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Life-Saving Impact</h3>
            <p className="text-gray-700">Every donation has the power to save multiple lives.</p>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
            <Star className="text-[#fc4848] mx-auto mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">User-Friendly Platform</h3>
            <p className="text-gray-700">
              Our seamless interface makes donating and finding donors easy.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 py-12 bg-gray-200">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Join Us & Save Lives Today!</h2>
        <p className="mb-6 text-gray-700">
          Become a donor or request a donation – together, we can make a difference.
        </p>
        <a
          href="/signup"
          className="px-6 py-3 bg-[#fc4848] hover:bg-red-600 text-white rounded-lg text-lg font-semibold shadow-md transition"
        >
          Sign Up Now
        </a>
      </div>
    </div>
  );
};

export default About;