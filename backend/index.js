import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import TextRouter from "./route/textAnalyzer.js";
import HistoryRouter from "./route/history.js";
import AudioRouter from "./route/audioAnalyze.js";
import ImageRouter from "./route/imageAnalysis.js";

dotenv.config({
  path:"./.env"
});


const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://anumaan:pagal@fakenews.0v4an.mongodb.net/?retryWrites=true&w=majority&appName=FakeNews")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));


// API Routes
app.use("/api/analyze",TextRouter);
app.use('/api/history',HistoryRouter);
app.use('/api/analyze-audio',AudioRouter);
app.use('/api/analyze-image',ImageRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});