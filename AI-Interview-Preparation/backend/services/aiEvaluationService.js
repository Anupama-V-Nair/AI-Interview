/**
 * AI Answer Evaluation Service
 * Real implementation integrating OpenAI and Google GenAI
 */

const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');

/**
 * Bulk evaluate all answers in a session
 * @param {Array} questions - Array of question objects from session
 * @param {Array} answers - Array of answer objects from session
 * @returns {Promise<Array>} Array of evaluated answer objects
 */
exports.evaluateSessionAnswers = async (questions, answers) => {
  console.log(`🤖 Evaluating ${answers.length} answers using AI...`);

  const hasOpenAI = !!(process.env.OPENAI || process.env.OPENAI_API_KEY);
  const hasGemini = !!process.env.GEMINI_API_KEY;

  let openai = null;
  let gemini = null;

  if (hasOpenAI) {
    openai = new OpenAI({ apiKey: process.env.OPENAI || process.env.OPENAI_API_KEY });
  } else if (hasGemini) {
    gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } else {
    console.warn("⚠️ Neither OPENAI nor GEMINI_API_KEY found, falling back to mock scoring.");
  }

  const evaluatedAnswers = await Promise.all(answers.map(async (answer, index) => {
    // If answer doesn't exist or wasn't recorded, return 0 score
    if (!answer || !answer.recorded || !answer.transcript || answer.transcript.trim().length === 0) {
      return {
        ...answer,
        score: 0,
        feedback: "Question skipped or audio not clearly recorded.",
        improvements: "Ensure your microphone is picking up your voice clearly."
      };
    }

    const questionObj = questions[index];
    if (!questionObj) return answer;

    // Dynamic AI Prompt
    const prompt = `You are an expert technical and behavioral interviewer evaluating a candidate's answer.
Question Asked: "${questionObj.question}"
Expected Points/Context: "${questionObj.expectedAnswer || 'Provide an appropriate industry-standard answer'}"
Candidate's Actual Transcript: "${answer.transcript}"

Evaluate the answer critically but fairly. Provide a structured response in STRICT JSON formatting with EXACTLY these three keys:
- "score": A number between 0 and 100 representing the answer's quality.
- "feedback": A short string of 1-3 sentences directly praising what the candidate did right or pointing out what they specifically mentioned. Do NOT use generic placeholder text. Be highly specific to the given transcript. If the transcript is extremely short or irrelevant, explicitly point that out instead of hallucinating.
- "improvements": A short string of 1-3 sentences offering concrete, actionable advice on what they missed based on the expected points or how they could structure the answer better.

Return ONLY the JSON object.`;

    try {
      let parsedEvaluation = { score: 50, feedback: "Error evaluating", improvements: "Error evaluating" };

      if (hasOpenAI) {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", // Cost-effective and fast
          messages: [{ role: "system", content: "You are an AI interviewer evaluator." }, { role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3,
        });
        
        parsedEvaluation = JSON.parse(response.choices[0].message.content);
      } else if (hasGemini) {
        const result = await gemini.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          }
        });
        
        let textResponse = result.text.trim();
        if (textResponse.startsWith('\`\`\`json')) {
          textResponse = textResponse.replace(/^\`\`\`json/i, '').replace(/\`\`\`$/i, '').trim();
        } else if (textResponse.startsWith('\`\`\`')) {
          textResponse = textResponse.replace(/^\`\`\`/i, '').replace(/\`\`\`$/i, '').trim();
        }
        parsedEvaluation = JSON.parse(textResponse);
      } else {
        // Mock fallback if absolutely no keys are provided
        return mockEvaluateSingleAnswer(questionObj.question, questionObj.expectedAnswer, answer.transcript, answer);
      }

      // Ensure boundaries
      parsedEvaluation.score = typeof parsedEvaluation.score === 'number' ? Math.max(0, Math.min(100, parsedEvaluation.score)) : 50;

      return {
        ...answer,
        score: parsedEvaluation.score || 50,
        feedback: parsedEvaluation.feedback || "Good effort.",
        improvements: parsedEvaluation.improvements || "Practice expanding purely on the question."
      };
    } catch (evalError) {
      console.error("⚠️ AI Evaluation missed/failed (using mock):", evalError.message);
      return mockEvaluateSingleAnswer(questionObj.question, questionObj.expectedAnswer, answer.transcript, answer);
    }
  }));

  return evaluatedAnswers;
};

// Fallback logic if API completely fails
function mockEvaluateSingleAnswer(question, expectedAnswer, transcript, answerObj) {
  const words = transcript.trim().split(/\\s+/);
  const lowerTranscript = transcript.toLowerCase();
  const expectedKeywords = (expectedAnswer || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ')
    .filter(word => word.length > 4);
    
  let matchCount = 0;
  expectedKeywords.forEach(keyword => {
    if (lowerTranscript.includes(keyword)) matchCount++;
  });

  let score = 50 + Math.min(20, (words.length / 100) * 20);
  if (expectedKeywords.length > 0) {
    score += (matchCount / expectedKeywords.length) * 30;
  } else {
    score += 15;
  }
  score = Math.min(100, Math.max(0, Math.round(score)));

  return {
    ...answerObj,
    score,
    feedback: "Solid answer with good context.",
    improvements: "Ensure you clearly relate your response logically."
  };
}
