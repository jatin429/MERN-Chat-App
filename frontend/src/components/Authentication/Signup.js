import { Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import  axios from "axios";
import { useNavigate } from "react-router-dom";  

const Signup = () => {
    const [name,setName]=useState(null);
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [pic,setPic] =useState();
    const [loading,setLoading]=useState(false);
    
    const toast = useToast();
    const navigate=useNavigate();

    const postDetails=(pics)=>{
      setLoading(true);
      if(pics === undefined){
        toast({
         title: 'Please Select an Image!',
         status:"warning",
         duration: 5000,
         isClosable: true,
         position:"bottom"
        })
        return ;
      }
      if(pics.type==="image/png" || pics.type==="image/jpeg" || pics.type==="image/jpg"){
         const data=new FormData();
         data.append("file",pics);
         data.append("upload_preset","chat-app");
         data.append("cloud_name","dtnqarlnd");
         console.log("FormData:", data);
         fetch('https://api.cloudinary.com/v1_1/dtnqarlnd/image/upload',{
            method:"post",
            body:data,
         }).then((res)=>res.json())
         .then((data)=>{
            setPic(data.url.toString());
            console.log(data.url.toString());
            setLoading(false);
         })
         .catch((err)=>{
            console.log(err);
            console.log("force")
            setLoading(false);
         })
      }else{
         toast({
            title: 'Please Select an Image!',
            status:"warning",
            duration: 5000,
            isClosable: true,
            position:"bottom"
           });
           setLoading(false);
           return ;
      }
   }
   const submitHandler=async()=>{
      setLoading(true);
      if(!name || !email || !password || !confirmpassword){
         toast({
            title:"please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom",
         })
         setLoading(false);
         return ;
      }
      if(password !== confirmpassword){
         toast({
            title:"password do not match",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"bottom"
         })
         return ;
      }
      try{
            const config={
               headers:{
                  "Content-Type":"application/json",
               },
            }
            const {data}=await axios.post("/api/user",{name,email,password,pic},config);
            console.log("datahai",data);
            toast({
               title:"Registration Successfull",
               status:"success",
               duration:5000,
               isClosable:true,
               position:"bottom"
            });

      localStorage.setItem("userInfo",JSON.stringify(data));
      setLoading(false);      
      navigate("/chats") 
      }catch(err){ 
          toast({
            title:"error occurred",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom"
          });
          setLoading(false);
      }
   }
  return (
    <VStack spacing="5px">
        <FormControl id='first-name' isRequired>
           <FormLabel>Name</FormLabel>
           <Input placeholder='Enter Your Name'onChange={(e)=>setName(e.target.value)}/>
        </FormControl>

        <FormControl id='email' isRequired>
           <FormLabel>Email</FormLabel>
           <Input placeholder='Enter Your Email'onChange={(e)=>setEmail(e.target.value)}/>
        </FormControl>

        <FormControl id='password' isRequired>
           <FormLabel>Password</FormLabel>
           <Input  type='password' placeholder='Enter Your Password'onChange={(e)=>setPassword(e.target.value)}/>
        </FormControl>

        <FormControl id='confrimPassword' isRequired>
           <FormLabel>Confirm Password</FormLabel>
           <Input  type='password' placeholder='Enter Your Password'onChange={(e)=>setConfirmpassword(e.target.value)}/>
        </FormControl>

        <FormControl id='pic' isRequired>
           <FormLabel>Upload your Picture</FormLabel>
           <Input  type='file' p={1.5} accept='image/*' onChange={(e)=>postDetails(e.target.files[0])}/>
        </FormControl>

        <Button colorScheme="blue" w="100%" m="15px 0 0 0" onClick={submitHandler} isLoading={loading}>
        Sign Up
        </Button>
    </VStack>
  )
}
export default Signup