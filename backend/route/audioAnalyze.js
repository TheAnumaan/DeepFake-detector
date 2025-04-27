import express from "express";
import { upload } from "../middleware/fileUploader.js";
import { Article } from "../model/article.model.js";
import fs from "fs";
import { transcribeAudio } from "../service/whisperTranscription.js";
import { analyzeWithGemini } from "../service/geminiAnalyzer.js";
import { analyzeWithGroq } from "../service/groqAnalyzer.js";

const router = express.Router();

router.post("/",upload.single("audioFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const { source, title } = req.body;
    if (!source || !title) {
      return res.status(400).json({ error: "Source and title are required" });
    }

    const filePath = req.file.path;

    const transcription = await transcribeAudio(filePath);

    if (!transcription || transcription.trim() === "") {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }

    const analysisResultWithGroq = await analyzeWithGroq(
      title,
      transcription,
      source
    );
    const analysisResultsWithGemini = await analyzeWithGemini(
      title,
      transcription,
      source,
      analysisResultWithGroq
    );
    console.log(analysisResultsWithGemini);

    // Save to MongoDB
    const article = new Article({
      title,
      content: transcription,
      source,
      credibilityScore: analysisResultsWithGemini.credibilityScore,
      analysisResults:analysisResultsWithGemini,
      contentType: "audio",
      originalFileName: req.file.originalname,
    });

    await article.save();

    // Delete temporary file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      article,
      analysis: analysisResultsWithGemini,
      transcription,
    });
  } catch (error) {
    console.error("Audio analysis error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
