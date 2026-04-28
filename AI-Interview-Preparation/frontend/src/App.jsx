import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AIInterview from './pages/AIInterview';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import InterviewHistory from './pages/InterviewHistory';
import InterviewSetup from './pages/InterviewSetup';
import InterviewResult from './pages/InterviewResult';
import QuestionBank from './pages/QuestionBank';
function App() {
 
 return (
    <Router>
      <div className="App">
        {/* Show Navbar on all pages */}
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
            <Route path="/ai-interview/:sessionId" element={<AIInterview />} />
            <Route path="/analytics" element={<Analytics />} />
             <Route path="/interview-history" element={<InterviewHistory />} />
          <Route path="/interview-setup" element={<InterviewSetup />} />
           <Route path="/interview-result/:sessionId" element={<InterviewResult />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* We will create Login later */}
          <Route path="/login" element={<div className="p-20 text-center">Login Page Coming Soon</div>} />
          
<Route path="/question-bank" element={<QuestionBank />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
