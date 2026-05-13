// frontend/src/pages/Home.js
// frontend/src/pages/Home.jsx

import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  show: {
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  const containerRef = useRef(null);

  // AUTO SCROLL LOGIC (stops on user interaction)
  useEffect(() => {
    let index = 0;
    let autoScroll = true;

    const sections = containerRef.current.children;

    const stopScroll = () => {
      autoScroll = false;
    };

    window.addEventListener("wheel", stopScroll);
    window.addEventListener("touchstart", stopScroll);

    const interval = setInterval(() => {
      if (!autoScroll) return;

      index = (index + 1) % sections.length;

      sections[index].scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 2000); // realistic timing

    return () => {
      clearInterval(interval);
      window.removeEventListener("wheel", stopScroll);
      window.removeEventListener("touchstart", stopScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth bg-[#0F0F14] text-white"
    >

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-10 py-5 bg-[#0F0F14]/80 backdrop-blur border-b border-[#2A2A35]">
        <div className="h-20 flex items-center justify-center gap-3 border-b border-white/10 px-4">

        <img
          src="/logo.png"
          alt="AI Interview Prep Logo"
          className="w-10 h-10 object-contain"
        />

        <h1 className="text-xl font-bold text-white tracking-wide">
          AI-InterviewPrep
        </h1>

      </div>

        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="text-gray-300 hover:text-white">
            Dashboard
          </Link>

          <Link to="/login" className="text-gray-300 hover:text-white">
            Login
          </Link>

          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-purple-600 to-pink-500 px-5 py-2 rounded-lg font-semibold hover:bg-pink-500  transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="h-screen snap-start flex items-center justify-between px-10 pt-24 max-w-7xl mx-auto">

        {/* LEFT */}
        <motion.div
          className="w-1/2"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-bold leading-tight mb-6"
          >
            Master Your Interview <br />
            <span className="text-[#A78BCB]">
              With AI Practice
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-400 mb-8"
          >
            Real-time feedback on answers, confidence, and performance.
          </motion.p>

          <motion.div variants={fadeUp} className="flex gap-4">
            <Link
              to="/dashboard"
              className="bg-gradient-to-r from-purple-600 to-pink-500 px-8 py-3 rounded-lg hover:scale-105 transition"
            >
              Start Interview →
            </Link>
          </motion.div>
        </motion.div>

        {/* RIGHT - FLOATING CARDS */}
        <div className="w-1/2 relative flex justify-center">

          <div className="w-80 h-96 bg-[#1A1A24] rounded-2xl border border-[#2A2A35]" />

          <motion.div
            className="absolute top-10 left-10 bg-[#222230] px-4 py-3 rounded-xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            AI Score: 7.8
          </motion.div>

          <motion.div
            className="absolute bottom-10 right-10 bg-[#222230] px-4 py-3 rounded-xl"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          >
            Confidence: Medium
          </motion.div>

        </div>
      </section>

      {/* FEATURES */}
      <motion.section
        className="h-screen snap-start flex flex-col justify-center items-center px-10"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
      >
        <motion.h2
          variants={fadeUp}
          className="text-3xl font-bold mb-12"
        >
          Powerful AI Features
        </motion.h2>

        <div className="grid grid-cols-3 gap-8 max-w-5xl">

          {["AI Feedback", "Live Analysis", "Progress Tracking"].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1A24] p-6 rounded-xl border border-[#2A2A35]"
            >
              <h3 className="text-xl font-semibold mb-3">{item}</h3>
              <p className="text-gray-400">
                Smart evaluation with real-time insights.
              </p>
            </motion.div>
          ))}

        </div>
      </motion.section>

      {/* EXPERIENCE SECTION */}
      <section className="h-screen snap-start flex items-center justify-center">

        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">
            Experience Smart Interviews
          </h2>

          <p className="text-gray-400">
            AI adapts and improves your performance with each attempt.
          </p>
        </motion.div>

      </section>

      {/* FINAL CTA */}
      <section className="h-screen snap-start flex flex-col items-center justify-center text-center">

        <motion.h2
          className="text-4xl font-bold mb-6"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          Ready to Crack Your Interview?
        </motion.h2>

        <Link
          to="/dashboard"
          className="bg-gradient-to-r from-purple-600 to-pink-500 px-12 py-5 rounded-xl text-lg font-bold hover:scale-110 transition"
        >
          Get Started →
        </Link>

      </section>
      {/* Footer */}
      <footer className="min-h snap-start bg-[#0f172a] border-t border-gray-800 text-gray-400 py-10 flex-grow items-center">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              AI Interview Platform
            </h2>
            <p className="text-sm">
              Practice smarter with AI-powered mock interviews and feedback.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              <li><a href="/interview" className="hover:text-white">Interview</a></li>
              <li><a href="/history" className="hover:text-white">History</a></li>
              <li><a href="/settings" className="hover:text-white">Settings</a></li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white font-semibold mb-3">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>AI Question Generation</li>
              <li>Performance Analytics</li>
              <li>Resume-based Interviews</li>
              <li>Instant Feedback</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-3">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  GitHub
                </a>
              </li>

              <li>
                <a
                  href="https://linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
              <li> anjalikumari128989@gmail.com </li>
              <li>anupamanair2224@gmail.com</li>
              <li>singhdimple043@gmail.com </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} AI Interview Platform • Built with React & Tailwind CSS
        </div>
      </footer>

    </div>
  );
};

export default Home;