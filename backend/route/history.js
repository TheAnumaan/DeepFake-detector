import express from "express";
import { Article } from "../model/article.model.js";
import verifyUser from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/",verifyUser,async (req,res) => {
    try {
        const user = req.user;

        const articles = await Article.find({user:user._id}).sort({ createdAt: -1 }).limit(20);
        res.json(articles);
      } catch (error) {
        res.status(500).json({ error: 'Server error fetching history' });
      }
});

export default router;