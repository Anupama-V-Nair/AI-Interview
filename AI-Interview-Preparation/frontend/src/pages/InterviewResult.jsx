import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const InterviewResult = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    loadInterviewResult();
  }, [sessionId]);

  const loadInterviewResult = async () => {
    try {
      const response = await api.get(`/interview/${sessionId}`);
      const sessionData = response.data.data;
      setSession(sessionData);

      // Mock analysis data (replace with actual AI evaluation)
      setAnalysis(generateMockAnalysis(sessionData));
    } catch (err) {
      console.error('Failed to load interview result:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAnalysis = (session) => {
    const totalQuestions = session.questions?.length || 0;
    const answeredQuestions = session.answers?.filter(a => a && a.recorded).length || 0;

    // Calculate overall score from real evaluated answers
    let totalScore = 0;
    let scoredAnswers = 0;
    let strengthsSet = new Set();
    let improvementsSet = new Set();

    const questionFeedback = session.questions?.map((q, index) => {
      const answer = session.answers && session.answers[index];
      const score = answer?.score || 0;
      const feedback = answer?.feedback || "No answer recorded.";
      const improvements = answer?.improvements || "Answer the question to get improvement feedback.";

      if (answer && answer.recorded) {
        totalScore += score;
        scoredAnswers++;
        if (score >= 80) strengthsSet.add("Strong handle on " + q.category);
        if (score < 60) improvementsSet.add("Review topics around " + q.category);
        if (improvements && improvements.length > 5) improvementsSet.add(improvements);
      }

      return {
        question: q.question,
        transcript: answer?.transcript || "No transcript recorded.",
        score: Math.round(score),
        feedback: feedback,
        improvements: improvements,
        category: q.category
      };
    }) || [];

    const overallScore = scoredAnswers > 0 ? Math.round(totalScore / scoredAnswers) : 0;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;

    return {
      overallScore,
      completionRate,
      strengths: strengthsSet.size > 0 ? Array.from(strengthsSet).slice(0, 4) : ['Consistent effort'],
      areasForImprovement: improvementsSet.size > 0 ? Array.from(improvementsSet).slice(0, 4) : ['Try to provide more detailed answers'],
      questionFeedback
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative animate-pulse">

        {/* Background Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 p-8 max-w-7xl mx-auto">

          {/* HEADER SKELETON */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-8">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

              <div>

                <div className="h-12 w-80 bg-white/10 rounded-2xl mb-4"></div>

                <div className="h-4 w-96 bg-white/5 rounded-lg"></div>
              </div>

              <div className="h-14 w-48 bg-cyan-500/20 rounded-2xl"></div>
            </div>
          </div>

          {/* SCORE OVERVIEW */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white/5 border border-white/10 rounded-3xl p-6"
              >

                <div className="flex items-center justify-between mb-6">

                  <div className="w-14 h-14 rounded-2xl bg-white/10"></div>

                  <div className="w-20 h-6 rounded-full bg-white/10"></div>
                </div>

                <div className="h-4 w-32 bg-white/5 rounded-lg mb-4"></div>

                <div className="h-10 w-24 bg-white/10 rounded-xl"></div>
              </div>
            ))}
          </div>

          {/* MAIN ANALYSIS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">

            {/* LEFT LARGE PANEL */}
            <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">

              <div className="h-8 w-56 bg-white/10 rounded-xl mb-8"></div>

              <div className="space-y-6">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="bg-black/20 border border-white/5 rounded-2xl p-6"
                  >

                    <div className="flex items-center justify-between mb-5">

                      <div className="h-6 w-40 bg-white/10 rounded-lg"></div>

                      <div className="h-7 w-24 bg-white/10 rounded-full"></div>
                    </div>

                    <div className="space-y-3">

                      <div className="h-4 w-full bg-white/5 rounded-lg"></div>

                      <div className="h-4 w-[90%] bg-white/5 rounded-lg"></div>

                      <div className="h-4 w-[70%] bg-white/5 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="space-y-6">

              {/* Performance Chart */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

                <div className="h-7 w-40 bg-white/10 rounded-lg mb-6"></div>

                <div className="h-[250px] rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">

                  <div className="w-40 h-40 rounded-full border-[18px] border-white/10 border-t-cyan-500/30"></div>
                </div>
              </div>

              {/* AI Feedback */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

                <div className="h-7 w-36 bg-white/10 rounded-lg mb-5"></div>

                <div className="space-y-4">

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="bg-black/20 border border-white/5 rounded-2xl p-4"
                    >

                      <div className="h-5 w-32 bg-white/10 rounded-lg mb-3"></div>

                      <div className="space-y-2">

                        <div className="h-3 w-full bg-white/5 rounded"></div>

                        <div className="h-3 w-[85%] bg-white/5 rounded"></div>

                        <div className="h-3 w-[60%] bg-white/5 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION ANALYSIS */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <div className="h-8 w-64 bg-white/10 rounded-xl mb-8"></div>

            <div className="space-y-5">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-black/20 border border-white/5 rounded-2xl p-6"
                >

                  <div className="h-6 w-[70%] bg-white/10 rounded-lg mb-5"></div>

                  <div className="space-y-3 mb-6">

                    <div className="h-4 w-full bg-white/5 rounded"></div>

                    <div className="h-4 w-[90%] bg-white/5 rounded"></div>

                    <div className="h-4 w-[75%] bg-white/5 rounded"></div>
                  </div>

                  <div className="flex gap-3">

                    <div className="h-8 w-24 bg-green-500/10 rounded-full"></div>

                    <div className="h-8 w-28 bg-cyan-500/10 rounded-full"></div>

                    <div className="h-8 w-20 bg-purple-500/10 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !analysis) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center px-6">

        <div className="bg-white/5 border border-white/10 rounded-3xl p-10 text-center max-w-md w-full">

          <div className="text-6xl mb-5">
            📭
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            No Results Found
          </h2>

          <p className="text-slate-400 mb-8">
            We couldn't find any interview analysis data.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-4 rounded-2xl font-semibold text-white hover:scale-[1.02] transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">

          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-medium mb-5">
            AI Interview Analysis
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Interview Results
          </h1>

          <p className="text-slate-400 text-lg">
            {session.jobRole} •{" "}
            {new Date(session.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* OVERALL SCORE */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-10 mb-8 backdrop-blur-xl">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left */}
            <div>

              <h2 className="text-3xl font-bold mb-4">
                Overall Performance
              </h2>

              <p className="text-slate-400 max-w-xl leading-relaxed mb-6">
                Your interview responses were analyzed based on technical
                accuracy, communication clarity, confidence, and problem-solving.
              </p>

              <div className="flex gap-4 flex-wrap">

                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-cyan-400">
                    {session.questions?.length || 0}
                  </div>

                  <div className="text-slate-400 text-sm mt-1">
                    Questions
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-emerald-400">
                    {session.answers?.filter(a => a?.recorded).length || 0}
                  </div>

                  <div className="text-slate-400 text-sm mt-1">
                    Answered
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.floor((session.actualDuration || 0) / 60)}m
                  </div>

                  <div className="text-slate-400 text-sm mt-1">
                    Duration
                  </div>
                </div>
              </div>
            </div>

            {/* Right Score */}
            <div className="relative flex items-center justify-center">

              <div className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">

                <div className="w-52 h-52 rounded-full bg-[#020617] border border-white/10 flex flex-col items-center justify-center">

                  <div className="text-6xl font-bold text-cyan-400">
                    {analysis.overallScore}%
                  </div>

                  <div className="text-slate-400 mt-2">
                    Overall Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STRENGTHS + IMPROVEMENTS */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Strengths */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8">

            <h3 className="text-2xl font-bold text-emerald-400 mb-6">
              Strengths
            </h3>

            <div className="space-y-4">
              {analysis.strengths.map((strength, index) => (
                <div
                  key={index}
                  className="bg-black/20 border border-white/5 rounded-2xl p-4 text-slate-200"
                >
                  {strength}
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-3xl p-8">

            <h3 className="text-2xl font-bold text-yellow-400 mb-6">
              Areas for Improvement
            </h3>

            <div className="space-y-4">
              {analysis.areasForImprovement.map((area, index) => (
                <div
                  key={index}
                  className="bg-black/20 border border-white/5 rounded-2xl p-4 text-slate-200"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QUESTION FEEDBACK */}
        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 mb-8">

          <h2 className="text-3xl font-bold mb-8">
            Question Analysis
          </h2>

          <div className="space-y-6">

            {analysis.questionFeedback.map((feedback, index) => (
              <div
                key={index}
                className="bg-black/20 border border-white/5 rounded-3xl p-6"
              >

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-5">

                  <div className="flex-1">

                    <div className="flex items-center gap-3 mb-4">

                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-1 rounded-full text-sm font-medium">
                        Question {index + 1}
                      </span>

                      <span className="bg-white/5 text-slate-300 border border-white/10 px-4 py-1 rounded-full text-sm">
                        {feedback.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold leading-relaxed">
                      {feedback.question}
                    </h3>
                  </div>

                  <div className="text-4xl font-bold text-cyan-400">
                    {feedback.score}%
                  </div>
                </div>

                <div className="space-y-5">

                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2">
                      Your Response
                    </h4>

                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-slate-300 italic">
                      {feedback.transcript}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2">
                      AI Feedback
                    </h4>

                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-slate-300">
                      {feedback.feedback}
                    </div>
                  </div>

                  {feedback.improvements &&
                    feedback.improvements !== "-" && (
                      <div>
                        <h4 className="text-sm uppercase tracking-wider text-slate-500 mb-2">
                          Suggested Improvement
                        </h4>

                        <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 text-slate-300">
                          {feedback.improvements}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-center gap-5">

          <button
            onClick={() => navigate("/interview-setup")}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 px-8 py-4 rounded-2xl font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Start Another Interview
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold transition-all duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;