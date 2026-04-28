/**
 * AI Question Generation Service
 * Integrated with Google Gemini SDK
 */

const { GoogleGenAI } = require('@google/genai');
const OpenAI = require('openai');

// Hardcoded fallback in case API errors out
const questionBanks = {
  Technical: {
    'Frontend Developer': [
      {
        question: "Explain the difference between let, const, and var in JavaScript.",
        category: 'Technical',
        expectedAnswer: 'Should cover scope, hoisting, and reassignment rules'
      },
      {
        question: "How does React's virtual DOM work?",
        category: 'Technical',
        expectedAnswer: 'Should explain diffing algorithm and reconciliation'
      },
      {
        question: "What are React hooks? Give examples of useState and useEffect.",
        category: 'Technical',
        expectedAnswer: 'Should explain functional component state management'
      }
    ],
    'Backend Developer': [
      {
        question: "Explain REST API principles.",
        category: 'Technical',
        expectedAnswer: 'Should cover HTTP methods, statelessness, resources'
      },
      {
        question: "How do you handle authentication in Node.js?",
        category: 'Technical',
        expectedAnswer: 'Should mention JWT, sessions, or OAuth'
      }
    ],
    // Default technical questions for unknown roles
    default: [
      {
        question: "Describe a challenging technical problem you solved.",
        category: 'Technical',
        expectedAnswer: 'Should demonstrate problem-solving approach'
      },
      {
        question: "How do you ensure code quality in your projects?",
        category: 'Technical',
        expectedAnswer: 'Should mention testing, linting, code reviews'
      }
    ]
  },
  
  Behavioral: {
    default: [
      {
        question: "Tell me about a time you worked in a team under pressure.",
        category: 'Behavioral',
        expectedAnswer: 'Should use STAR method: Situation, Task, Action, Result'
      },
      {
        question: "How do you handle feedback or criticism?",
        category: 'Behavioral',
        expectedAnswer: 'Should show growth mindset and openness'
      },
      {
        question: "Where do you see yourself in 5 years?",
        category: 'Behavioral',
        expectedAnswer: 'Should show ambition aligned with company goals'
      }
    ]
  }
};

exports.generateQuestions = async (jobRole, difficulty = 'Medium', questionType = 'Mixed', duration = 15, resumeText = null) => {
  let questionCount = 5;
  if (duration <= 5) {
    questionCount = 5;
  } else if (duration <= 15) {
    questionCount = 10;
  } else {
    questionCount = 15;
  }

  let questions = [];

  // Try fetching from AI
  try {
    const hasOpenAI = !!(process.env.OPENAI || process.env.OPENAI_API_KEY);
    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (!hasOpenAI && !hasGemini) {
      throw new Error("Missing both OPENAI and GEMINI_API_KEY in environment variables");
    }

    const timestamp = Date.now(); // Injecting randomness

    let prompt = `You are an expert technical interviewer conducting an interview for a ${jobRole} position.
Difficulty level: ${difficulty}
Question Types needed: ${questionType === 'Mixed' ? 'A fair mix of Technical and Behavioral' : questionType}

Task:
Generate EXACTLY ${questionCount} highly relevant and realistic interview questions for this specific role.
- Technical questions MUST focus on specific coding concepts, programming languages, data structures, or framework knowledge typical for a ${jobRole}.
- IMPORTANT: Do NOT ask broad System Design, Architecture, or "design a microservice" questions. Keep questions focused on normal, practical coding and clear conceptual knowledge with definitive answers.
- Behavioral questions MUST focus on professional situations, teamwork, and past experiences relevant to a ${jobRole}.
- Do NOT generate obscure, trick, or completely unrelated questions.

Timestamp seed for randomness: ${timestamp}.

Return the response strictly as a JSON object with a single key "questions" containing an array.
Example Format:
{
  "questions": [
    {
      "question": "Tailored and highly relevant question string here...",
      "category": "Technical or Behavioral",
      "expectedAnswer": "A short, 1-2 sentence phrase summarizing what core concepts candidate should mention."
    }
  ]
}`;

    if (resumeText) {
      prompt += `\n\nCRITICAL RESUME CONTEXT:\nThe candidate has provided their resume. You MUST tailor at least half of the questions to their specific past experiences, projects, and skills listed below.\n\nRESUME TEXT:\n${resumeText.substring(0, 3000)}\n`;
    }

    let parsedData = null;

    if (hasOpenAI) {
      console.log(`🧠 Using OpenAI for question generation (${jobRole})`);
      const openai = new OpenAI({ apiKey: process.env.OPENAI || process.env.OPENAI_API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // or gpt-3.5-turbo if 4o-mini isn't available, but 4o-mini is best
        messages: [{ role: "system", content: "You are an AI interviewer." }, { role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.85,
      });
      
      const content = response.choices[0].message.content;
      parsedData = JSON.parse(content).questions;
    } else {
      console.log(`🧠 Using Gemini for question generation (${jobRole})`);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt + "\n\nPlease return strictly JSON. e.g. {\"questions\": [...]}",
        config: {
          responseMimeType: 'application/json',
          temperature: 0.85,
        }
      });

      let textResponse = result.text.trim();
      if (textResponse.startsWith('```json')) {
        textResponse = textResponse.replace(/^```json/i, '').replace(/```$/i, '').trim();
      } else if (textResponse.startsWith('```')) {
        textResponse = textResponse.replace(/^```/i, '').replace(/```$/i, '').trim();
      }

      parsedData = JSON.parse(textResponse).questions || JSON.parse(textResponse);
    }

    if (Array.isArray(parsedData) && parsedData.length > 0) {
      console.log(`🎯 Successfully generated ${parsedData.length} unique AI questions for ${jobRole}`);
      return parsedData.slice(0, questionCount); // ensure exact count
    } else {
      throw new Error("Invalid format received from AI");
    }

  } catch (error) {
    console.error("⚠️ AI Question Generation failed (using fallbacks):", error.message || error);
    if (error.status) console.error("API Status:", error.status);
    
    // Fallback logic - tailored slightly by jobRole
    const categories = questionType === 'Mixed' ? ['Technical', 'Behavioral'] : [questionType];
    
    for (const category of categories) {
      const bank = questionBanks[category];
      if (!bank) continue;
      
      const roleQuestions = bank[jobRole] || bank.default;
      
      for (const q of roleQuestions) {
        if (questions.length >= questionCount) break;
        if (!questions.some(existing => existing.question === q.question)) {
          // Tailor the default questions if falling back
          let tailoredQuestion = q.question;
          if (bank[jobRole] === undefined && category === 'Technical') {
             tailoredQuestion = q.question.replace('your projects', `your projects as a ${jobRole}`);
             tailoredQuestion = tailoredQuestion.replace('problem you solved', `problem you solved related to ${jobRole}`);
          }

          if (difficulty === 'Hard' && category === 'Technical') {
            questions.push({
              ...q,
              question: `${tailoredQuestion} (Advanced: ${getFollowUp(tailoredQuestion)})`,
              difficulty: 'Hard'
            });
          } else {
            questions.push({ ...q, question: tailoredQuestion, difficulty });
          }
        }
      }
    }
    
    while (questions.length < questionCount) {
      const fallback = questionBanks.Behavioral.default[
        questions.length % questionBanks.Behavioral.default.length
      ];
      if (!questions.some(q => q.question === fallback.question)) {
        questions.push({ ...fallback, difficulty });
      }
    }

    return questions;
  }
};

/**
 * Helper: Generate follow-up questions for Hard difficulty
 */
function getFollowUp(mainQuestion) {
  const followUps = [
    "How would you optimize this for performance?",
    "What edge cases should be considered?",
    "How would you test this implementation?",
    "What are the trade-offs of this approach?",
    "How would this scale with 10x more data?"
  ];
  return followUps[Math.floor(Math.random() * followUps.length)];
}
