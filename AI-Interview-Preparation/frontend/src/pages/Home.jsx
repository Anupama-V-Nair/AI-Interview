// frontend/src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Hero Section */}
      <div className="max-w-6xl mx-auto px-8 py-20 flex items-center justify-between">
        <div className="w-1/2">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            Master Your Interview <br/>
            <span className="text-teal-600">With AI-Practice</span>
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Get real-time feedback on your speech, body language, and answers. 
            Practice with our AI interviewer anytime, anywhere.
          </p>
          <div className="flex gap-4">
            <Link to="/dashboard" className="bg-teal-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-teal-700">
              Start Practice
            </Link>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-50">
              View Demo
            </button>
          </div>
        </div>
        
        {/* Right Side Image Placeholder */}
        <div className="w-1/2 flex justify-center">
            <div className="w-80 h-96 bg-gradient-to-tr from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-gray-400">Dashboard Preview</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;