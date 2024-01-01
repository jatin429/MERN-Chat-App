const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      console.log("User ID not sent with the request");
      return res.sendStatus(400);
    }

    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.status(200).send(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
     
      // Create a new chat
      const createdChat = await Chat.create(chatData);

      // Populate the users and send the response
      const fullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );

      return res.status(200).send(fullChat);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const fetchChats=async(req,res)=>{
    try{
Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
      .populate("users","-password")
      .populate("groupAdmin","-password")
      .populate("latestMessage")
      .sort({updatedAt:-1})
      .then(async (results)=>{
        results =await User.populate(results,{
            path:"latestMessage.sender",
            select:"name pic email",
        });
        return res.status(200).send(results);
      })
    }catch(err) {
        return res.status(400);
    }
}

const createGroupChat=async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please fill all the fields"});
    }

    var users=JSON.parse(req.body.users);

    if(users.length < 2){
        return res.status(400).send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);
    console.log(users)

    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })

        const fullGroupChat=await Chat.findOne({_id:groupChat._id}).populate("users","-password").populate("groupAdmin","-password")
         
        return  res.status(200).json(fullGroupChat);
        

    }catch(err){
            return res.status(400);
    }
}

const renameGroup=async(req,res)=>{
    const {chatName,chatId} =req.body;

    const updatedChat=await Chat.findByIdAndUpdate(chatId,{chatName},{new:true}).populate("users","-password").populate("groupAdmin","-password")
    if(!updatedChat){
      res.status(404);
    }
    else{
      res.json(updatedChat);
    }

}

const addToGroup=async(req,res)=>{
  const {userId,chatId}=req.body;

  const updatedGroup=await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password");

  if(!updatedGroup){
    res.status(404);
  }
  else{
    res.json(updatedGroup);
  }
}

const removeFromGroup=async(req,res)=>{
  const {userId,chatId}=req.body;

  const updatedGroup=await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).populate("users","-password").populate("groupAdmin","-password");

  if(!updatedGroup){
    res.status(404);
  }
  else{
    res.json(updatedGroup);
  }
}

module.exports = { accessChat ,fetchChats, createGroupChat, renameGroup, addToGroup,removeFromGroup};
