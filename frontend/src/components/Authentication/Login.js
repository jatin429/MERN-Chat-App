import {Button, FormControl, FormLabel, Input,  VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { useNavigate } from "react-router-dom"; 
import axios from "axios"

const Login = () => {
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const [loading,setLoading]=useState();

       
    const toast = useToast();
    const navigate =useNavigate();

    const submitHandler=async()=>{
      setLoading(true);
      if(!email || !password){
        toast({
          title:"please fill all the fields",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
        return ;
      }
      try{
        const config={
          headers:{
             "Content-Type":"application/json",
          },
       }
       const {data}=await axios.post("/api/user/login",{email,password},config);
       console.log("datahai",data);
       toast({
          title:"Login Successfull",
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
        <FormControl id='email' isRequired>
           <FormLabel>Email</FormLabel>
           <Input placeholder='Enter Your Email'onChange={(e)=>setEmail(e.target.value)} value={email}/>
        </FormControl>

        <FormControl id='password' isRequired>
           <FormLabel>Password</FormLabel>
           <Input  type='password' placeholder='Enter Your Password'onChange={(e)=>setPassword(e.target.value)} value={password}/>
        </FormControl>

        <Button colorScheme="blue" w="100%" m="15px 0 0 0" onClick={submitHandler} isLoading={loading}>
        Login
        </Button>

        <Button variant="solid"  colorScheme="red" w="100%" onClick={()=>{setEmail("jatin@gmail.com"); setPassword("123456")}}>
        Get Guest User Credentials 
        </Button>
    </VStack>
  )
}

export default Login