const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

// verify authentication
exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        console.log("token", token);
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You are not authenticated!",
            });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: "Token is not valid",
                });
            }
            
            try {
                const user = await User.findById(decoded.id).select("-password");
                
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found",
                    });
                }

                req.user = user;
                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    success: false,
                    message: "Internal server error",
                });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
