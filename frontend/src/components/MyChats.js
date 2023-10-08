import { AddIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/layout";
import { Box, Button, Grid, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogic";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat === null ? "none" : "flex", md: "flex" }}
      flexDirection={"column"}
      alignItems={"center"}
      w={{ base: "100%", md: "31%" }}
      //backgroundColor={"#2A2D34"}
      bg="white"
      borderRadius={"lg"}
      borderWidth={"1px"}
      p={3}
      textColor={"black"}
      h={"100%"}
    >
      <Grid
        templateColumns="1fr auto"
        gap={3}
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        alignItems={"center"}
        w={"100%"}
      >
        <Box>My Chats</Box>
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="purple"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Grid>

      <Box
        display="flex"
        flexDirection={"column"}
        w={"100%"}
        h={"100%"}
        p={3}
        bg="#F8F8F8"
        borderRadius="lg"
        overflowY="hidden" // Apply overflowY to the outer Box
      >
        {chats ? (
          <Stack
            overflowY={"scroll"} // Apply overflowY here for the chat list
            maxHeight="100%" // Set a maximum height for the chat list
          >
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor={"pointer"}
                bg={selectedChat === chat ? "#805ad5" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                _hover={{
                  background: "blue.400",
                  color: "white",
                }}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
