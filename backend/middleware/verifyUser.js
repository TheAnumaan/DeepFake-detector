import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

const verifyUser = async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        console.log(req.headers,req.cookies);
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        console.log('Token:', token);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized user' });
        }

        // Verify the token
        const verifyToken = jwt.verify(token, "4c1e7f6b9a6e3d1c0b8f5e4a7c2d9f8a0e1b3c7a5d6f9e8b1c3d0f7a2b6c4e9d");

        if (!verifyToken) {
            return res.status(400).json({ success: false, message: "Unauthorized user" });
        }

        // Find the user in the database
        const user = await User.findById(verifyToken?.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export default verifyUser;