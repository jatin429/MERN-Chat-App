const User=require("../models/userModel")
const generateToken=require("../config/generateToken")
const registerUser=async(req,res)=>{
    const {name,email,password,pic}=req.body;

    if(!name || !email || !password){
        return res.status(400).json({
             success:false,
             message:"Please enter all the fields"
        });
    }

    const userExists=await User.findOne({email});

    if (userExists){
        return res.status(400).json({
            success:false,
            message:"user already exist"
        });
    }

    const user=await User.create({
        name,
        email,
        password,
        pic,
    });

    if(user){
        return res.status(201).json({
             _id:user._id,
             name:user.name,
             email:user.email,
             password:user.password,
             pic:user.pic,
             token:generateToken(user._id),
        })
    }else{
        return res.status(400).json({
            success:false,
            message:"failed to create user"
        })
    }
}

const authUser=async(req,res)=>{
    const {email,password}=req.body;

    const user=await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        return res.status(201).json({
             _id:user._id,
             name:user.name,
             email:user.email,
             pic:user.pic,
             token:generateToken(user._id),
        })}else{
            return res.status(400).json({
                success:false,
                message:"failed to Login"
            })
        }
}

const allUsers = async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  };

module.exports= { registerUser,authUser ,allUsers };