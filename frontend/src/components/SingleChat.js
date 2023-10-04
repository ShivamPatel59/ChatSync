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

const SingleChat = ({
    fetchAgain, setFetchAgain
}) => {
    const [messages, setMessages] = React.useState([]); 
    const [loading, setLoading] = React.useState(false);
    const [newMessage, setNewMessage] = React.useState("");
    const toast = useToast();
    const {user, selectedChat,setSelectedChat} = ChatState();

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

    useEffect(()=>{
      fetchMessages();
    },[selectedChat])

    const sendMessage = async  (event) => {
        if(event.key === "Enter"){
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
                console.log("data: ",data);
              setNewMessage("");
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
