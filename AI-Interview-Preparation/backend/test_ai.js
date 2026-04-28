require('dotenv').config();
const { generateQuestions } = require('./services/aiQuestionService');

async function test() {
  try {
    const questions = await generateQuestions("Python Engineer", "Medium", "Technical");
    console.log("Successfully generated AI questions:", questions);
  } catch(err) {
    console.error("Test failed:", err);
  }
}

test();
