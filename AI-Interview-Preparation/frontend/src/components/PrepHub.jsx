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

      
      
    </div>
  );
};

export default PrepHub;