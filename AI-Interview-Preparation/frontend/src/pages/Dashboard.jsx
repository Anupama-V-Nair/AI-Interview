// frontend/src/pages/Dashboard.js
import React from 'react';
import MetricsGrid from '../components/MetricsGrid';
import PrepHub from '../components/PrepHub';
import CameraRecorder from '../components/CameraRecorder'; // Import new component

const Dashboard = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Header */}
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-teal-600"></span> aiinterviewcoach
        </h1>
        <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, User</span>
            <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">U</div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Video Section - NOW USING REAL CAMERA */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Current Interview Session</h2>
            
            {/* Replace placeholder with CameraRecorder */}
            <CameraRecorder />
            
            <div className="mt-4 flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                <span className="font-medium text-gray-600">Virtual Interviewer: Sarah K.</span>
                <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-1 rounded">● Online</span>
            </div>
          </div>

          {/* Metrics Section */}
          <MetricsGrid />
        </div>

        {/* RIGHT COLUMN (1/3 width) */}
        <div className="lg:col-span-1">
          <PrepHub />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;