import express from "express";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/",async (req,res) => {
    try {
        const {username,email,password} = req.body;

        if(!username || !email || !password) return res.status(404).json({success:false,message:"Please provide all field"});

        const userExist = await User.findOne({username:username,email:email});

        if(userExist) return res.status(400).json({success:false,message:"User already exist"});

        const hashPassword = await bcrypt.hash(password,10);

        const user = new User({
            username:username,
            email:email,
            password:hashPassword
        });

        await user.save();

        return res.status(200).json({success:true,message:"User successfully store"});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"Something went wrong in user signUp"});
    }
});

export default router;