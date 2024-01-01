import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons"
import React, { useState } from 'react'
import { ChatState } from '../../context/chatProvider'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvator/UserListItem'
import { getSender } from '../../config/chatLogics'

const SlideDrawer = () => {
  const [search, setSearch] = useState()
  const [searchResult, setsearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setloadingChat] = useState()

  const {user,setSelectedChat,chats, setChats,notification, setNotification}=ChatState();

  const navigate=useNavigate();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/")
  }

   const toast=useToast();
  const handleSearch=async()=>{
    if(!search){ 
       toast({
        title:"please Enter something in search !",
        warning:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left"
       });
       return ;
    }
    try{
      setLoading(true);
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`,

          }
        }
        const {data}=await axios.get(`/api/user?search=${search}`,config)
        console.log("Received data:", data);
        setLoading(false);
        setsearchResult(data);
    }catch(err){
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const accessChat=async(userId)=>{
    try{
         setloadingChat(true);
         const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,

          }
        }
        const {data}=await axios.post("/api/chat",{userId},config);
        
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setSelectedChat(data);
        setloadingChat(false);
        onClose();

    }catch(err){

    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map(n=>(
                <MenuItem key={n._id} onClick={()=>{
                  setSelectedChat(n.chat);
                  setNotification(notification.filter((f)=>f !== n));
                }}>
                  {n.chat.isGroupChat ? `New Message in ${n.chat.chatName}` :`New Message from ${getSender(user,n.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
          <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              {/* <MenuDivider /> */}
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
        </Box>
        <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
        </>
        )
}

export default SlideDrawer;