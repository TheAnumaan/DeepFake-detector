import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    url: String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title: String,
    content: String,
    source: String,
    credibilityScore: Number,
    analysisResults: Object,
    createdAt: { type: Date, default: Date.now }
})

export const Article= mongoose.model('Article', articleSchema);