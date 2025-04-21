import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
    url: String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title: String,
    content: String,
    contentType:String,
    source: String,
    credibilityScore: Number,
    analysisResults: Object,
    originalFileName:String,
},{timestamps:true});

export const Article= mongoose.model('Article', articleSchema);