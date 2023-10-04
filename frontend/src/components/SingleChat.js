import React from 'react'
import { ChatState } from '../Context/ChatProvider';
import { Box , IconButton} from '@chakra-ui/react';
import { Text } from '@chakra-ui/layout';
import { ArrowBackIcon } from '@chakra-ui/icons';
import {getSender,getSenderFull} from '../config/ChatLogic';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
const SingleChat = ({
    fetchAgain, setFetchAgain
}) => {

    const {user, selectedChat,setSelectedChat} = ChatState();

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
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
            ) : (
              <Box textColor="gray.700">
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal          
                     fetchAgain={fetchAgain}
                     setFetchAgain={setFetchAgain}
                />
              </Box>
            )}
          </Text>
          <Box  
            display={{ base: "flex", md: "flex" }}
            flexDirection="column"
            justifyContent="flex-end"
            p={3}
            bg="red.100"
            w={"100%"}
            h={"100%"}
            borderRadius="lg"
            overflowY="hidden"
          >
            Messages Here
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

export default SingleChat
