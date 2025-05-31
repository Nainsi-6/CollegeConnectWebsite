import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar"; // Adjust the import path as needed

const EventsPage = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    organizedBy: "",
    date: "",
    time: "",
    venue: "",
    image: null,
    googleFormLink: "",
  });
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    deleteExpiredEvents();
  }, [events]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5005/api/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const deleteExpiredEvents = async () => {
    const today = new Date().toISOString().split("T")[0];
    const validEvents = events.filter(event => event.date >= today);

    if (validEvents.length !== events.length) {
      try {
        await axios.post("http://localhost:5005/api/events/deleteExpired", {
          expiredEvents: events.filter(event => event.date < today),
        });
        setEvents(validEvents);
      } catch (error) {
        console.error("Error deleting expired events:", error);
      }
    }
  };

  const handleFileUpload = (e) => {
    setNewEvent({ ...newEvent, image: e.target.files[0] });
  };

  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.venue) {
      alert("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", newEvent.title);
    formData.append("organizedBy", newEvent.organizedBy);
    formData.append("date", newEvent.date);
    formData.append("time", newEvent.time);
    formData.append("venue", newEvent.venue);
    if (newEvent.image) {
      formData.append("file", newEvent.image);
    }
    formData.append("googleFormLink", newEvent.googleFormLink);

    try {
      await axios.post("http://localhost:5005/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchEvents();
      setShowEventForm(false);
      setNewEvent({
        title: "",
        organizedBy: "",
        date: "",
        time: "",
        venue: "",
        image: null,
        googleFormLink: "",
      });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.organizedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Main content with top padding to account for fixed navbar */}
      <div className="pt-20 px-6 py-8 text-white">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-indigo-400 mb-2">
                Upcoming Events
              </h1>
              <p className="text-gray-300 text-lg">
                Discover and join exciting events in our community
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 px-4 py-3 pl-10 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                onClick={() => setShowEventForm(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Event
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10" />
              </svg>
              <p className="text-xl text-gray-400 mb-2">No events available</p>
              <p className="text-gray-500">Be the first to create an event for the community!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredEvents.map((event, index) => (
                <div
                  key={index}
                  className="bg-gray-800 hover:bg-gray-750 transition-all duration-300 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer border border-gray-700 hover:border-indigo-500"
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  {event.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-48 w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-sm">Organized by: {event.organizedBy}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m16-4V7a2 2 0 00-2-2h-4m-2 0V3a2 2 0 00-2-2 2 2 0 00-2 2v2" />
                        </svg>
                        <span className="text-sm">{event.date} at {event.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-300">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{event.venue}</span>
                      </div>
                    </div>

                    {event.googleFormLink && (
                      <a
                        href={event.googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Register Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 p-4">
          <div className="bg-gray-800 border border-gray-600 rounded-xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-indigo-400">Add New Event</h2>
              <button
                onClick={() => setShowEventForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Event Title *"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <input
                type="text"
                placeholder="Organized By"
                value={newEvent.organizedBy}
                onChange={(e) => setNewEvent({ ...newEvent, organizedBy: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <input
                type="text"
                placeholder="Venue *"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
                />
              </div>
              
              <input
                type="url"
                placeholder="Registration Form Link (optional)"
                value={newEvent.googleFormLink}
                onChange={(e) => setNewEvent({ ...newEvent, googleFormLink: e.target.value })}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={addEvent}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all duration-200"
              >
                Create Event
              </button>
              
              <button
                onClick={() => setShowEventForm(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;

