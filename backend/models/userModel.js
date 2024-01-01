const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");


const userModel=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    pic:{
        type:String,
        default:"https://th.bing.com/th/id/R.8e2c571ff125b3531705198a15d3103c?rik=muXZvm3dsoQqwg&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fpng-user-icon-person-icon-png-people-person-user-icon-2240.png&ehk=MfHYkGonqy7I%2fGTKUAzUFpbYm9DhfXA9Q70oeFxWmH8%3d&risl=&pid=ImgRaw&r=0",
    },
},
 {
    timestamps:true,
 }
);

userModel.methods.matchPassword=async function (enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

userModel.pre("save",async function(next){
    if(!this.isModified){
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

const User=mongoose.model("User",userModel);

module.exports=User;
