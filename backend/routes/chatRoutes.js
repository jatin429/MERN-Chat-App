const express=require("express");
const router=express.Router();
const {verifyToken} =require("../middleware/authMiddleware")
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} =require("../controllers/chatControllers")

router.route("/").post(verifyToken,accessChat).get(verifyToken,fetchChats);
router.route("/group").post(verifyToken,createGroupChat);
router.route("/rename").put(verifyToken,renameGroup);
router.route("/groupadd").put(verifyToken,addToGroup);
router.route("/groupremove").put(verifyToken,removeFromGroup);





module.exports=router;