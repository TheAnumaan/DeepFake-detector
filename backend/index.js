const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();


const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    // Accept audio files only
    if (!file.originalname.match(/\.(mp3|wav|m4a|ogg|aac|flac)$/)) {
      return cb(new Error('Only audio files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Function to transcribe audio using Hugging Face API
async function transcribeAudio(filePath) {
  try {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('model', 'openai/whisper-large-v3');
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          ...formData.getHeaders()
        }
      }
    );
    
    return response.data.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
}

// Add this to your existing Express app
module.exports = function(app) {
  // API endpoint for audio analysis
  app.post('/api/analyze-audio', upload.single('audioFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file uploaded' });
      }
      
      // Get metadata from request
      const { source, title } = req.body;
      
      if (!source || !title) {
        return res.status(400).json({ error: 'Source and title are required' });
      }
      
      // Transcribe the audio file
      const filePath = req.file.path;
      const transcription = await transcribeAudio(filePath);
      
      if (!transcription || transcription.trim() === '') {
        return res.status(400).json({ error: 'Could not transcribe audio or transcription is empty' });
      }
      
      // Analyze the transcribed content using Gemini
      const analysisResults = await analyzeWithGemini(title, transcription, source);
      
      // Save to database (using your existing Article model)
      const article = new Article({
        title,
        content: transcription,
        source,
        credibilityScore: analysisResults.credibilityScore,
        analysisResults,
        contentType: 'audio',
        originalFileName: req.file.originalname
      });
      
      await article.save();
      
      // Remove the temporary audio file
      fs.unlinkSync(filePath);
      
      res.json({
        success: true,
        article,
        analysis: analysisResults,
        transcription
      });
    } catch (error) {
      console.error('Audio analysis error:', error);
      res.status(500).json({ error: 'Server error during audio analysis' });
    }
  });
};









const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://anumaan:pagal@fakenews.0v4an.mongodb.net/?retryWrites=true&w=majority&appName=FakeNews")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Article Schema
const articleSchema = new mongoose.Schema({
    url: String,
    title: String,
    content: String,
    source: String,
    credibilityScore: Number,
    analysisResults: Object,
    contentType: { type: String, enum: ['text', 'audio'], default: 'text' },
    originalFileName: String,
    createdAt: { type: Date, default: Date.now }
  });

const Article = mongoose.model('Article', articleSchema);

// Initialize Gemini API
// Initialize Gemini API correctly
const genAI = new GoogleGenerativeAI("AIzaSyArh4_TJ84bttOZYWH4vB44vrq9OT9oOfM");

// Helper function for Gemini analysis
async function analyzeWithGemini(title, content, source) {
  const prompt = `
    Analyze this news article for potential misinformation or fake news:
    
    Title: ${title}
    Source: ${source}
    Content: ${content}
    
    Evaluate based on:
    1. Credibility of source
    2. Presence of clickbait elements
    3. Emotional language
    4. Factual inconsistencies
    5. Balance of perspectives
    6. Citation of sources
    7. Expert opinions
    8. Recent publication
    
    Provide:
    - A credibility score from 0-100
    - Identification of potentially misleading statements
    - Recommended verification steps
    - An overall assessment
    
    Format response as JSON with these fields:
    {
      "credibilityScore": number,
      "misleadingElements": [string],
      "verificationSteps": [string],
      "overallAssessment": string
    }
  `;

  try {
    // Get the correct model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Generate content with the correct format
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || 
                      text.match(/{[\s\S]*}/);
                      
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    
    throw new Error("Failed to parse JSON response");
  } catch (error) {
    console.error("Error analyzing with Gemini:", error);
    return {
      credibilityScore: 50,
      misleadingElements: ["Error in analysis"],
      verificationSteps: ["Try again later"],
      overallAssessment: "Analysis failed due to technical error"
    };
  }
}

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { url, title, content, source } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    // Analyze content with Gemini
    const analysisResults = await analyzeWithGemini(title, content, source);
                   
    // Save to database
    const article = new Article({
      url,
      title,
      content,
      source,
      credibilityScore: analysisResults.credibilityScore,
      analysisResults
    });
    
    await article.save();
    
    res.json({
      success: true,
      article,
      analysis: analysisResults
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Server error during analysis' });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(20);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});