import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, AlertCircle } from "lucide-react";
import heroVideo from "../assets/hero-video.mp4"; // Replace with your video file

const HeroSection = () => {
  return (
    <section className="relative bg-white text-gray-800 pt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between min-h-[90vh]">
        {/* Left Content */}
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Donate Blood, <span className="text-[#fc4848]">Save Lives</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Every drop counts! Help those in need by donating blood or organs.
            Find donors nearby and make a difference today.
          </p>

          {/* Login & Signup Buttons */}
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="flex items-center bg-[#fc4848] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e03e3e] transition"
            >
              <LogIn className="mr-2" /> Login
            </Link>
            <Link
              to="/signup"
              className="flex items-center border-2 border-[#fc4848] text-[#fc4848] px-6 py-3 rounded-lg font-semibold hover:bg-[#fc4848] hover:text-white transition"
            >
              <UserPlus className="mr-2" /> Sign Up
            </Link>
          </div>

          {/* Emergency Blood Request Button */}
          <div className="mt-6">
            <Link
              to="/emergency"
              className="flex items-center text-[#fc4848] font-semibold text-lg hover:text-[#e03e3e] transition cursor-pointer bg-white px-4 py-2 rounded-md shadow-md border border-[#fc4848]"
            >
              <AlertCircle className="mr-2" />
              Urgent blood needed? Request emergency donations now!
            </Link>
          </div>
        </motion.div>

        {/* Right Video */}
        <motion.div
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-[90%] md:w-[80%] rounded-lg shadow-lg ml-80"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;