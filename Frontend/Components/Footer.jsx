import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, HeartPulse } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#223634] via-[#1b3a4b] to-[#312450] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Logo & About Section */}
        <div>
          <Link to="/" className="flex items-center text-2xl font-bold">
            <HeartPulse className="mr-2 text-[#fb4673]" />
            <span className="text-[#28bca9]">BloodBond</span>
          </Link>
          <p className="mt-4 text-gray-300">
            Saving lives through blood & organ donation. Join us and make a difference today!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-[#28bca9]">Quick Links</h3>
          <ul className="mt-4 space-y-2">
            <li><Link to="/" className="hover:text-[#fb4673]">Home</Link></li>
            <li><Link to="/about" className="hover:text-[#fb4673]">About Us</Link></li>
            {/* <li><Link to="/donate" className="hover:text-[#fb4673]">Donate</Link></li>
            <li><Link to="/find-donor" className="hover:text-[#fb4673]">Find a Donor</Link></li>
            <li><Link to="/requests" className="hover:text-[#fb4673]">Donation Requests</Link></li>
            <li><Link to="/events" className="hover:text-[#fb4673]">Events</Link></li> */}
            <li><Link to="/contact" className="hover:text-[#fb4673]">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-semibold text-[#28bca9]">Contact Us</h3>
          <div className="mt-4 space-y-3">
            <p className="flex items-center"><Mail className="mr-2 text-[#fb4673]" /> support@BloodBond.com</p>
            <p className="flex items-center"><Phone className="mr-2 text-[#fb4673]" /> +1 234 567 890</p>
            <p className="flex items-center"><MapPin className="mr-2 text-[#fb4673]" /> 123 Donation Street, NY</p>
          </div>
        </div>

      </div>

      {/* Social Media & Newsletter */}
      <div className="mt-10 text-center border-t border-gray-600 pt-6">
        
        {/* Social Media Links */}
        <div className="flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook className="text-white hover:text-[#fb4673]" size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter className="text-white hover:text-[#fb4673]" size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram className="text-white hover:text-[#fb4673]" size={24} />
          </a>
          
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-[#28bca9]">Subscribe for Updates</h3>
          <div className="mt-3 flex justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 w-64 rounded-l-md focus:outline-none text-black"
            />
            <button className="bg-[#fb4673] hover:bg-[#28bca9] px-4 py-2 rounded-r-md">
              Subscribe
            </button>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-gray-400">&copy; {new Date().getFullYear()} BloodBond. All Rights Reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
