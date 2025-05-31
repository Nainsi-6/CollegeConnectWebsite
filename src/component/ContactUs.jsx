import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const ContactUs = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setSubmitted(true);
      setFeedback('');
    } else {
      alert('Please enter your feedback before submitting.');
    }
  };

  return (
    <div
      className="bg-cover bg-center min-h-screen p-8"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1400&q=80")', // Beautiful background
        backgroundColor: '#1a202c',
      }}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <Navbar />
      </div>

      <div
        className="shadow-xl backdrop-blur-sm"
        style={{
          padding: '50px 40px',
          maxWidth: '650px',
          margin: '100px auto',
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
        }}
      >
        {!submitted ? (
          <>
            <h2 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent tracking-wide">
              Share Your Thoughts ✨
            </h2>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              rows="6"
              className="border-2 border-cyan-400 w-full text-lg text-white rounded-xl py-3 px-4 mb-6 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                resize: 'none',
              }}
            />

            <button
              onClick={handleFeedbackSubmit}
              className="text-lg font-semibold text-white bg-gradient-to-r from-teal-400 to-cyan-600 hover:from-cyan-600 hover:to-teal-400 transition duration-300 ease-in-out rounded-xl py-3 w-full shadow-lg"
            >
              ✉️ Submit Feedback
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6 animate-fade-in">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-600 bg-clip-text text-transparent">
              Thank You! 💌
            </h2>
            <p className="text-lg text-white opacity-90">
              Your feedback means a lot to us!
            </p>
            <img
              src="form.png"
              alt="Happy Face"
              className="w-28 h-28 rounded-full shadow-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
