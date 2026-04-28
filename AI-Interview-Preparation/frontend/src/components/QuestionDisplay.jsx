import React from 'react';

const QuestionDisplay = ({ question, questionNumber, totalQuestions }) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold px-3 py-1 rounded-full">
          Q{questionNumber}
        </span>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {question.category}
        </span>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
        {question.question}
      </h2>
      
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>⏱️</span>
        <span>Suggested time: 2-3 minutes</span>
      </div>
    </div>
  );
};

export default QuestionDisplay;