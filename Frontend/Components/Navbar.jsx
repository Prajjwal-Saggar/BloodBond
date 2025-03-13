import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, HeartPulse } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center text-white text-2xl font-bold">
          <HeartPulse className="mr-2 text-[#fb4673]" />
          <span className="text-[#28bca9]">BloodBond</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
          <NavItem to="/events" label="Events" />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white/10 backdrop-blur-lg text-white flex flex-col items-center space-y-4 py-4"
        >
          <NavItem to="/" label="Home" />
          <NavItem to="/about" label="About" />
          <NavItem to="/contact" label="Contact" />
        </motion.div>
      )}
    </nav>
  );
};

const NavItem = ({ to, label }) => (
  <Link
    to={to}
    className="text-[#fc4848] text-lg font-semibold hover:text-[#d13636] transition duration-300"
  >
    {label}
  </Link>
);

export default Navbar;