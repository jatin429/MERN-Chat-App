const express=require("express");
const router=express.Router();
const { registerUser,authUser ,allUsers} = require('../controllers/userControllers');
const {verifyToken} =require("../middleware/authMiddleware")


router.route("/").post(registerUser).get(verifyToken,allUsers);
router.post("/login",authUser);






module.exports=router;