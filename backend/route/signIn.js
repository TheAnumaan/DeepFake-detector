import express from "express";
import { User } from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/",async (req,res) => {
    try {
        const {email,password} = req.body;

        if(!email || !password) return res.status(404).json({success:false,message:"Please provide all field"});

        const userExist = await User.findOne({email:email});

        if(!userExist) return res.status(400).json({success:false,message:"User not exist"});

        const verifyPassword = bcrypt.compare(password,userExist.password);

        if(!verifyPassword) return res.status(400).json({success:false,message:"Please provide valid password"});

        const token = jwt.sign(
            {
                id:userExist._id,
            },
            "4c1e7f6b9a6e3d1c0b8f5e4a7c2d9f8a0e1b3c7a5d6f9e8b1c3d0f7a2b6c4e9d",
            {expiresIn:"1d"}
        );

        const options = {
            httpOnly:true,
            secure:true
        };

        return res.cookie("token",token,options).status(201).json({success:true,message:"User successfully login"});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message:"Something went wrong in user signIn"});
    }
});

export default router;