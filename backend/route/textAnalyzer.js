import express from "express";
import {analyzeWithGroq} from "../service/groqAnalyzer.js";
import {Article} from "../model/article.model.js";
import { analyzeWithGemini } from "../service/geminiAnalyzer.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.post("/",verifyUser,async (req,res) => {
    try {
        const { url, title, content, source } = req.body;
        const user = req.user;
        
        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }

        const articalExist = await Article.findOne({
          contentType: "text",
          user: user._id,
          title,
          source,
        });
    
        if(articalExist) {
          res.json({ success: true, analysis: articalExist.analysisResults });
        }
        
        const analysisResultsByGroq = await analyzeWithGroq(title, content, source);
        const analysisResultsByGemini = await analyzeWithGemini(title, content, source,analysisResultsByGroq);
        console.log(analysisResultsByGemini);
                       
        // Save to database
        const article = new Article({
          url,
          user:user._id,
          title,
          content,
          source,
          contentType:"text",
          credibilityScore: analysisResultsByGemini.credibilityScore,
          analysisResults:analysisResultsByGemini
        });
        
        await article.save();
        
        res.json({
          success: true,
          article,
          analysis: analysisResultsByGemini
        });
      } catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Server error during analysis' });
      }
})

export default router;