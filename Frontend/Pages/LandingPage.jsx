import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-glass bg-opacity-30 backdrop-blur-md shadow-md fixed top-0 left-0 w-full p-4 flex justify-between items-center md:px-10 px-4">
      <h1 className="text-secondary text-2xl font-bold">BloodBond</h1>
      <ul className="hidden md:flex space-x-6">
        <li className="text-textDark hover:text-secondary cursor-pointer">Home</li>
        <li className="text-textDark hover:text-secondary cursor-pointer">About</li>
        <li className="text-textDark hover:text-secondary cursor-pointer">Contact</li>
      </ul>
      <button className="md:hidden text-textDark text-xl">☰</button>
    </nav>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-primary to-teal-400 flex flex-col justify-center items-center text-textDark px-4 md:px-0">
      <Navbar />
      <div className="mt-20 text-center p-6 max-w-lg">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Save a Life, Donate Today!</h2>
        <p className="text-base md:text-lg max-w-2xl">
          Join our mission to connect blood and organ donors with those in need. Your donation can
          be the gift of life.
        </p>
        <div className="mt-6 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
        <div className="mt-6 flex flex-col md:flex-row gap-4">
  <button className="bg-secondary text-white px-8 py-3 rounded-xl shadow-lg w-full md:w-auto text-lg font-semibold">
    Login
  </button>
  <button className="bg-secondary text-white px-8 py-3 rounded-xl shadow-lg w-full md:w-auto text-lg font-semibold">
    Sign Up
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default LandingPage;
