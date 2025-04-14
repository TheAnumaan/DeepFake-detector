import express from "express";
import { Article } from "../model/article.model.js";

const router = express.Router();

router.get("/",async (req,res) => {
    try {
        const articles = await Article.find().sort({ createdAt: -1 }).limit(20);
        res.json(articles);
      } catch (error) {
        res.status(500).json({ error: 'Server error fetching history' });
      }
});

export default router;