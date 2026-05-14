import React, { useState } from "react";
import {
  User,
  Bell,
  Moon,
  Sun,
  Shield,
  Trash2,
  Save,
} from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      question: "How does AI Interview work?",
      answer:
        "AI Interview simulates real interview scenarios with AI-generated questions, instant feedback, and performance tracking to help you prepare effectively.",
    },
    {
      question: "Can I practice technical and HR interviews?",
      answer:
        "Yes, you can practice technical interviews, HR rounds, aptitude discussions, and role-specific interview sessions.",
    },
    {
      question: "Do I get feedback after interviews?",
      answer:
        "The platform provides detailed feedback on communication, confidence, accuracy, and overall interview performance.",
    },
    {
      question: "Is my interview history saved?",
      answer:
        "Yes, your previous interview sessions and reports are stored securely in your dashboard for future review.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <span className="bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium">
              AI Interview Support Center
            </span>

            <h1 className="text-5xl font-bold mt-6 leading-tight">
              Need Help With Your
              <span className="text-cyan-400"> Interview Preparation?</span>
            </h1>

            <p className="text-slate-300 text-lg mt-6 leading-relaxed">
              Our support team is here to help you with interview practice,
              technical issues, account management, and platform guidance.
              Explore FAQs or contact us directly.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-xl font-semibold shadow-lg shadow-cyan-500/20">
                Contact Support
              </button>

              <button className="border border-slate-700 hover:border-cyan-400 px-6 py-3 rounded-xl font-semibold transition">
                View Documentation
              </button>
            </div>
          </div>

          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h2 className="text-3xl font-bold text-cyan-400">24/7</h2>
                <p className="text-slate-300 mt-2">Support Availability</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h2 className="text-3xl font-bold text-cyan-400">95%</h2>
                <p className="text-slate-300 mt-2">Issue Resolution</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h2 className="text-3xl font-bold text-cyan-400">10k+</h2>
                <p className="text-slate-300 mt-2">Students Supported</p>
              </div>

              <div className="bg-slate-800 rounded-2xl p-6 text-center">
                <h2 className="text-3xl font-bold text-cyan-400">4.9★</h2>
                <p className="text-slate-300 mt-2">User Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold">Project FAQs</h2>
            <p className="text-slate-400 mt-3">
              Common questions related to the AI Interview project.
            </p>
          </div>

          <div className="space-y-5 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500 transition"
              >
                <h3 className="text-xl font-semibold text-cyan-400 mb-3">
                  {faq.question}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
