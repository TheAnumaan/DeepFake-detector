import express from "express";
import { upload } from "../middleware/fileUploader.js";
import { AnalyzeImage } from "../service/AnalyzeImageGroq.js";
import { Article } from "../model/article.model.js";
import { analyzeWithGroq } from "../service/groqAnalyzer.js";
import { analyzeWithGemini } from "../service/geminiAnalyzer.js";

const router = express.Router();

router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const { source, title } = req.body;
    if (!source || !title) {
      return res.status(400).json({ error: "Source and title are required" });
    }

    const filePath = req.file.path;

    const imageData = await AnalyzeImage(filePath); //Analyze image and get in text form using Groq.
    if (!imageData || imageData.trim() === "") {
      return res.status(400).json({ error: "Could not transcribe image" });
    }

    const analysisResultWithGroq = await analyzeWithGroq(
      title,
      imageData,
      source
    );
    const analysisResultsWithGemini = await analyzeWithGemini(
      title,
      imageData,
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
      analysisResultsWithGemini,
      contentType: "audio",
      originalFileName: req.file.originalname,
    });

    await article.save();

    // Delete temporary file
    fs.unlinkSync(filePath);

    res.json({ success: true, article, analysis: analysisResultsWithGemini });
  } catch (error) {
    console.error("Audio analysis error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
