import express from "express";

const router = express.Router();

router.get("/",(req,res) => {
    try {
        const options = {
            httpOnly:true,
            secure:true
        }

        return res.clearCookie("token",options).status(200).json({success:true,message:"user signOut successfully"});
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({success:false,message: 'Something went wrong in user signOut'});
    }
});

export default router;