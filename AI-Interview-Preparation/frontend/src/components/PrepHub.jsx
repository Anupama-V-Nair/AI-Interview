// frontend/src/components/PrepHub.js
import React from 'react';
import { FileText, PlayCircle, Briefcase, Calendar } from 'lucide-react';
import ResumeUploader from './ResumeUploader';

const PrepHub = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-6">Interview Preparation Hub</h2>
      
      {/* Card 1 */}
    <ResumeUploader />

      {/* Card 2 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-3">
          <PlayCircle className="text-teal-500" />
          <h3 className="font-semibold">Behavioral Practice</h3>
        </div>
        <button className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 text-sm font-medium">
          Start Practice
        </button>
      </div>

      {/* Card 3 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="text-purple-500" />
          <h3 className="font-semibold">Industry Mocks</h3>
        </div>
        <select className="w-full p-2 border rounded bg-white text-sm">
          <option>Software Engineer</option>
          <option>Product Manager</option>
        </select>
      </div>
      
       {/* Card 4 */}
       <div className="p-4 bg-gray-50 rounded-lg border hover:shadow-md transition">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="text-orange-500" />
          <h3 className="font-semibold">Mock Scheduler</h3>
        </div>
        <p className="text-xs text-gray-500">Book a session with an expert</p>
      </div>
    </div>
  );
};

export default PrepHub;