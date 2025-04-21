import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const verifyUser = async (req,_,next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization.spliet(' ')[1];

        if(!token) return res.status(401).json({success:false,message: 'Unauthorized user'});

        const verifyToken = jwt.verify(token,"4c1e7f6b9a6e3d1c0b8f5e4a7c2d9f8a0e1b3c7a5d6f9e8b1c3d0f7a2b6c4e9d");

        if(!verifyToken) return res.status(400).json({success:false,message:"Unauthorized user"});

        const user = await User.findById(verifyToken?.id);

        req.user = user;
        next();
    } catch (error) {
        console.error(error.message);
        next();
    }
}

export default verifyUser;