import React, { useEffect } from 'react'
import ChatState from '../Context/ChatProvider'
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
function MyChats()  {
    const [loggedUser,setLoggedUser]=useState();
    const {selectedChat, setSelectedChat, user, setUser, chats, setChats
    } = ChatState();
    const toast = useToast();

    const fetchChats = async () => {
        try{
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(
                `http://localhost:5000/api/chat`,
                config
            );
            setChats(data);
        }
        catch(error){
            toast({
                title: "Error Occured in my chats!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
    useEffect(()=>{
        const userInfo =JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo){
            setUser(userInfo);
            fetchChats();
        }
        
    })
  return (
    <div>
      cHAY
    </div>)
};

export default MyChats
