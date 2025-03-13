import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";

const API_KEY = "AIzaSyD9wYUNE67azqMmYCUKQQ2ATfOopW8JFNk"; // Replace with your actual API key
const CALENDAR_ID = "singh0810.akash@gmail.com"; // Replace with your Calendar ID

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const now = new Date().toISOString();
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${now}&singleEvents=true&orderBy=startTime`
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API Error Response:", errorData); // Log the error response
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        console.log("API Response:", data); // Log the API response
        setEvents(data.items || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500 p-6">
          <FaInfoCircle className="text-5xl mb-4 mx-auto" />
          <p className="text-xl">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col items-center">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mt-20 text-center p-6 max-w-4xl w-full"
      >
        <div className="flex items-center justify-center mb-6">
          <MdEventAvailable className="text-5xl text-red-500 mr-4" />
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">
            Upcoming Events
          </h2>
        </div>
        <p className="text-lg text-gray-700 mb-10">
          Join our blood donation events and help save lives
        </p>

        <div className="space-y-8">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white border-l-4 border-red-500 p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {event.summary}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="text-red-500 mr-3" />
                        <span>
                          {new Date(
                            event.start.dateTime || event.start.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaClock className="text-red-500 mr-3" />
                        <span>
                          {new Date(
                            event.start.dateTime || event.start.date
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center text-gray-700">
                          <FaMapMarkerAlt className="text-red-500 mr-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    {event.description && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-10 bg-white rounded-lg shadow-md"
            >
              <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No upcoming events found.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Events;
