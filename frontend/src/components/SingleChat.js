import React,{useEffect, useState} from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box , FormControl, IconButton, Spinner,Input,useToast} from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {getSender,getSenderFull} from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css";
import ScrollableChat from './ScrollableChat';

import io from "socket.io-client";

const ENDPOINT="http://localhost:5000";

var socket,selectedChatCompare;


const SingleChat = ({
    fetchAgain, setFetchAgain
}) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [messages, setMessages] = React.useState([]); 
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState("");
    const toast = useToast();
    const {user, selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [Typing, setTyping] = useState(false);
    const [IsTyping,setIsTyping]=useState(false); 

    const fetchMessages= async() =>{
      if(!selectedChat)return;
      try{
          const config={
            headers:{
              Authorization:`Bearer ${user.token}`,
            }
          };
          setLoading(true);
          const { data } = await axios.get(
            `http://localhost:5000/api/message/${selectedChat._id}`,config
          );
          // console.log(data);
          // console.log("data", data)
          setMessages(data);
          setLoading(false);
          socket.emit("join chat", selectedChat._id);
      }
      catch(error){
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isclosable: true,
          position: "bottom",
        });
      }
    }

     useEffect(() => {
       socket = io(ENDPOINT);
       socket.emit("setup", user);
       socket.on("connected", () => {
         setSocketConnected(true);
       });

        socket.on("typing",()=>setIsTyping(true));

        socket.on("stop typing",()=>setIsTyping(false));

     }, []);
    useEffect(()=>{
      fetchMessages();
      selectedChatCompare=selectedChat;
    },[selectedChat])

    useEffect(()=>{
      socket.on("message received", (newMessageRecieved) => {
        if(!selectedChatCompare || selectedChatCompare._id!== newMessageRecieved.chat._id){
          //give notification
          if(!notification.includes(newMessageRecieved.chat._id)){
            setNotification([newMessageRecieved,...notification]);
            setFetchAgain(!fetchAgain);
          }
        }
        else{
          setMessages([...messages,newMessageRecieved]);
        }
      }
    )
  });

    const sendMessage = async  (event) => {
        if(event.key === "Enter" && newMessage){
          socket.emit("stop typing", selectedChat._id);
            try{
              const config = {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.token}`,
                },
              };
              const { data } = await axios.post(
                "http://localhost:5000/api/message",
                {
                  content: newMessage,
                  chat: selectedChat._id,
                },
                config
                );
                // console.log("data: ",data);
              setNewMessage("");
                socket.emit("new message", data);
              setMessages([...messages,data]);
            }catch(error){
                toast({
                    title: "Fail to send Message.",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
            }
        }
    }


    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if(!socketConnected)return;

        if(!Typing){
          setTyping(true);
          socket.emit("typing", selectedChat._id);
        }

        clearTimeout(Typing);
        const timeout=setTimeout(()=>{
          setTyping(false);
          socket.emit("stop typing", selectedChat._id);
        },3000);
        setTyping(timeout);

    } 

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexDir={"row"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => {
                setSelectedChat("");
              }}
            />
            {!selectedChat.isGroupChat ? (
                <>
                {getSender(user, selectedChat.users)}
                <ProfileModal  user={getSenderFull(user, selectedChat.users)} />
                </>
            ) : (
              <Box textColor="gray.700">
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal          
                     fetchAgain={fetchAgain}
                     setFetchAgain={setFetchAgain}
                     fetchMessages={fetchMessages}
                />
              </Box>
            )}
          </Text>
          <Box  
            display={{ base: "flex", md: "flex" }}
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="white.100"
            w={"100%"}
            h={"100%"}
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading? (
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="black.500"
                size="xl"
                w={20}
                h={20}
                margin={"auto"}
                alignSelf="center"
              />
            ) :(
              <div className='messages'>
                  <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Text display={IsTyping?"flex":"none"} fontSize="sm" color="gray.500" pb={1} textAlign="center">
                {getSender(user, selectedChat.users)} is typing...
              </Text>
              <Input 
                _hover={{ bg: "gray.400" }}
                variant="filled"
                bg="gray.400"
                border={10}
                placeholder="Type a message"
                placeholderTextColor="black"
                onChange={typingHandler}
                value={newMessage}
               />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="100%"
          fontSize="2xl"
          fontWeight="bold"
          color="gray.500"
        >
          <Text fontSize="3xl" color="gray.500" pb={3} textAlign="center">
            Click on a chat to start messaging ^_^
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;
