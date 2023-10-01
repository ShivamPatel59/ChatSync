import { Box, Tooltip,Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider,Input,useToast,Spinner
 } from '@chakra-ui/react'
import { Text } from '@chakra-ui/layout'
import { Avatar }
 from "@chakra-ui/react";
import axios from 'axios';
import UserListItem from "../UserAvatar/UserListItem"
import { useDisclosure } from '@chakra-ui/hooks';
import React from 'react'
import { useState } from 'react'
import { BellIcon,ChevronDownIcon } from '@chakra-ui/icons'
import ProfileModal from './ProfileModal'
import { ChatState } from "../../Context/ChatProvider";
import { useHistory } from 'react-router-dom'
import ChatLoading from '../ChatLoading'
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
} from "@chakra-ui/react";
const SideDrawer = () => {
    const[search, setSearch] = useState('')
    const {user}=ChatState();
    const {setSelectedChat} = ChatState();
    const [chats, setChats] = useState([]);
    const[searchResult, setSearchResult] = useState([])
    const [loading , setLoading] = useState(false)
    const [loadingChat , setLoadingChat] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast=useToast();
    // const [placement, setPlacement] = useState("left");
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
        // window.location.reload();
      };
      const handleSearch = async () => {
          if(!search){
              toast({
                  title:"Please Something to Search",
                  status:"error",
                  duration:3000,
                  isClosable:true,
                  position:"bottom-left"
              })
              return;
          }
          try {
              setLoading(true)
              const config = {
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                  },
              };
              const { data } = await axios.get(
                `http://localhost:5000/api/user?search&name=${search}`,
                config
              );
              console.log(data)
              setSearchResult(data);
              setLoading(false) 

          } catch (error) {
              toast({
                  title:"Something went wrong",
                  status:"error",
                  duration:3000,
                  isClosable:true,
                  position:"bottom-left"
              })
              setLoading(false)
          }

      };

    const accessChat = async (userId) => {
        setLoadingChat(true)
        onClose()
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(
              'http://localhost:5000/api/chat',{userId},config);

            if(!chats.find((c)=> c._id=== data._id))setChats([data, ...chats]);
            setSelectedChat(data)
            setLoadingChat(false)
            onClose();
        } catch (error) {
            setLoadingChat(false)
            toast({
                title:"Unable to open Chat",
                status:"error",
                duration:3000,
                isClosable:true,
                position:"bottom-left"
            })
        }
    }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="blackAlpha.600"
        boxShadow="md"
        w="100%"
        p="5px 10px 5px 10px"
        borderRadius="10px"
        // borderWidth="5px"
      >
        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search Users
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="fantasy">
          Chat App
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1}></BellIcon>
              {/* <ChevronDownIcon fontSize="xl" m={1}></ChevronDownIcon> */}
              {/* <MenuList></MenuList> */}
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                // name="User"
              />
            </MenuButton>
            <MenuList background="black">
              <ProfileModal user={user}>
                <MenuItem background="black">My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem background="black" onClick={logoutHandler}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
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
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer
