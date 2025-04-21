import express from "express";
import { upload } from "../middleware/fileUploader.js";
import Ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { transcribeAudio } from "../service/whisperTranscription.js";
import { analyzeWithGroq } from "../service/groqAnalyzer.js";
import { analyzeWithGemini } from "../service/geminiAnalyzer.js";
import { Article } from "../model/article.model.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI("AIzaSyC9HiiKleUtD2IhWUAmixl1FNRFsc_aWr8");

async function summarizeWithGemini(predictions) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `You are a multimodal AI assistant skilled in detecting deepfakes from image frames.

We are providing you with the results of a frame-wise deepfake detection analysis performed on a video.

Each frame was analyzed individually using an AI model and returned a prediction ("Real" or "Deepfake") along with a confidence score (0 to 1).

Below is the frame-wise analysis summary:

${predictions
  .map(
    (res, i) =>
      `Frame ${i + 1}: Prediction: ${res.prediction}, Confidence: ${(
        res.confidence * 100
      ).toFixed(2)}% `
  )
  .join("\n")}

Your task is to:

Review the frame-wise predictions and confidence values.

Analyze the proportion of "Deepfake" vs "Real" frames and their confidence scores.

Consider whether the video as a whole is likely to be fake or real.

Take into account the frequency and consistency of deepfake signals across frames.

Provide a final verdict as either:

Final Verdict: "Deepfake"

Final Verdict: "Real"

Also provide a brief reasoning (1-2 sentences) for the verdict.

Return the result in the following JSON format:

{ "prediction": "Deepfake" | "Real", "confidence": float between 0 and 1 (e.g., 0.87), "status": "success" }
    `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  return JSON.parse(jsonMatch[1]);
}

router.post("/",verifyUser,upload.single("videoFile"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const user = req.user;
    
    const { source, title } = req.body;
    if (!source || !title) {
      return res.status(400).json({ error: "Source and title are required" });
    }
    const videoPath = req.file.path;

    const articalExist = await Article.findOne({
      contentType: "video",
      user: user._id,
      title,
      source,
    });

    if(articalExist) {
      fs.unlinkSync(videoPath);
      res.json({ success: true, analysis: articalExist.analysisResults });
    }

    const transcription = await transcribeAudio(videoPath);

    if (!transcription || transcription.trim() === "") {
      return res.status(400).json({ error: "Could not transcribe audio" });
    }
    console.log(transcription);

    await new Promise((resolve, reject) => {
      Ffmpeg(videoPath)
        .output(`uploads/frame-%03d.jpg`)
        .outputOptions(["-vf", "fps=1/5"])
        .on("end", resolve)
        .on("error", reject)
        .run();
    });

    const results = [];
    const originalName = req.file.originalname;
    fs.unlinkSync(videoPath);
    const frameFiles = fs.readdirSync("uploads");

    for (const file of frameFiles) {
      const imageUrl = `uploads/${file}`;

      // Call Flask API for each frame
      const response = await axios.post("http://localhost:5000/analyze-image", {
        image_url: imageUrl,
      });

      results.push({
        frame: file,
        prediction: response.data.prediction,
        confidence: response.data.confidence,
      });

      fs.unlinkSync(imageUrl);
    }

    const EmotionResponse = await summarizeWithGemini(results);

    const analysisResultWithGroq = await analyzeWithGroq(
      title,
      transcription,
      source
    );
    const analysisResultsWithGemini = await analyzeWithGemini(
      title,
      transcription,
      source,
      analysisResultWithGroq,
      EmotionResponse
    );
    console.log(analysisResultsWithGemini);

    const article = new Article({
      user: user._id,
      title,
      source,
      credibilityScore: analysisResultsWithGemini.credibilityScore,
      analysisResults:analysisResultsWithGemini,
      contentType: "video",
      originalFileName: originalName,
    });

    await article.save();

    res.json({ success: true, article, analysis: analysisResultsWithGemini });
  } catch (error) {
    console.error("Image analysis error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;