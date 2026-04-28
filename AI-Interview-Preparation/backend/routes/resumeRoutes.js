// backend/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');

// Configure storage to use memory (no disk writing needed for resumes)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Endpoint
router.post('/upload', upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  try {
    const dataBuffer = req.file.buffer;
    let resumeText = '';
    
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(dataBuffer);
      resumeText = data.text;
    } else {
      // Basic fallback for txt/doc files if possible, though mostly just returning buffer string
      resumeText = dataBuffer.toString('utf8');
    }

    if (!resumeText || resumeText.trim().length < 20) {
      resumeText = "Candidate resume contains very little extractable text or is an image.";
    }
    
    // Call Gemini to get an analysis
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Analyze the following resume and return a strict JSON response with a "score" (number from 0 to 100), an array of 2-3 short "strengths" (strings), and an array of 1-2 short "weaknesses" (strings). Do not include markdown formatting. Resume Text: ${resumeText.substring(0, 5000)}`;
    
    const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.7,
        }
    });

    let textResponse = result.text.trim();
    if (textResponse.startsWith('```json')) textResponse = textResponse.replace(/^```json/i, '').replace(/```$/i, '').trim();
    else if (textResponse.startsWith('```')) textResponse = textResponse.replace(/^```/i, '').replace(/```$/i, '').trim();

    const analysis = JSON.parse(textResponse);

    res.json({ 
      message: 'Resume analyzed successfully', 
      fileName: req.file.filename,
      resumeText: resumeText,
      analysis: {
        score: analysis.score || 70,
        strengths: analysis.strengths || ['Good formatting'],
        weaknesses: analysis.weaknesses || ['Could add more details']
      }
    });
  } catch (error) {
    console.error("Resume analysis failed:", error);
    res.status(500).json({ error: 'Failed to analyze resume', details: error.message, stack: error.stack });
  }
});

module.exports = router;