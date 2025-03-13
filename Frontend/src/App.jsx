import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import HeroSection from "../Components/HeroSection";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import UserDashboard from "../Pages/UserDashboard";
import HospitalDashboard from "../Pages/HospitalDashboard";
import About from "../Pages/About";
import Event from "../Pages/Events";
import Contact from "../Pages/Contact";
import HospitalPage from "../Pages/HospitalPage";
import EmergencyRequest from "../Pages/EmergencyRequest";
import { Toaster } from 'react-hot-toast';
import EmergencySuccess from "../Pages/EmergencySuccess";

const App = () => {
  return (
    <Router>
      <Toaster /> {/* Add this */}
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HeroSection />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
            <Route path="/about" element={<About/>}/>
            <Route path="/events" element={<Event/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/hospital/:id" element={<HospitalPage />} />
            <Route path="/emergency" element={<EmergencyRequest />} />
            <Route path="/emergency/success" element={<EmergencySuccess/>} />

          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
