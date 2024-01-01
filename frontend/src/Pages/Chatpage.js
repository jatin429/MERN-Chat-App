import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider'
import SlideDrawer from "../components/miscellenious/SlideDrawer"
import Mychats from '../components/Mychats';
import ChatBox from '../components/ChatBox';
import { Box } from '@chakra-ui/react';

const Chatpage = () => {
  const {user}=ChatState();
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div style={{width:"100%"}}>
      {user && <SlideDrawer/>}
      <Box display="flex" justifyContent='space-between' w="100%" h="91.5vh" p="10px">
        {user && <Mychats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default Chatpage