import { useState } from 'react'
import './App.css'
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import AIInterview from "./pages/AIInterview";
import InterviewSetup from './pages/InterviewSetup';
import Analytics from "./pages/Analytics";
import InterviewHistory from "./pages/InterviewHistory";
import QuestionBank from "./pages/QuestionBank";
import InterviewResult from './pages/InterviewResult';
import AppLayout from "./layouts/AppLayout";

function App() {

  return (
    <BrowserRouter>
      <Routes>

        {/* Public Page */}
        <Route path="/" element={<Home />} />

        {/* App Layout Routes */}
        <Route element={<AppLayout />}>

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/interview" element={<InterviewSetup />} />
          <Route path="/interview/:sessionId" element={<AIInterview />} />

          <Route path="/analytics" element={<Analytics />} />

          <Route path="/history" element={<InterviewHistory />} />

          <Route path="/question-bank" element={<QuestionBank />} />

          <Route path="/ResumeAnalyzer" element={<ResumeAnalyzer />} />

          <Route
            path="/interview-result/:id"
            element={<InterviewResult />}
          />

        </Route>

      </Routes>
    </BrowserRouter>

  );
}

export default App
