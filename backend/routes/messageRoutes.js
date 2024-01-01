const express=require("express");
const router=express.Router();
const {verifyToken} =require("../middleware/authMiddleware")
const { sendMessage,allMessages} = require('../controllers/messageController');

router.route("/").post(verifyToken,sendMessage);
router.route("/:chatId").get(verifyToken,allMessages);




module.exports=router;