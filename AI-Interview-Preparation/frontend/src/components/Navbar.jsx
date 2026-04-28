// frontend/src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold">AI</div>
        <span className="text-xl font-bold text-gray-800">InterviewCoach</span>
      </div>
      
      <div className="flex gap-6">
        <Link to="/" className="text-gray-600 hover:text-teal-600 font-medium">Home</Link>
        <Link to="/dashboard" className="text-gray-600 hover:text-teal-600 font-medium">Dashboard</Link>
        <Link to="/login" className="text-gray-600 hover:text-teal-600 font-medium">Login</Link>
        <Link to="/interview-setup" className="text-gray-600 hover:text-teal-600 font-medium">Interview Setup   </Link>
        <Link to="/interview-history" className="nav-link">
  Interview History
</Link>
<Link to="/analytics" className="nav-link">
  📊 Analytics
</Link>
<Link to="/question-bank" className="nav-link">
  📚 Question Bank
</Link>
      </div>

      <button className="bg-teal-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-teal-700">
        Get Started
      </button>
    </nav>
  );
};

export default Navbar;