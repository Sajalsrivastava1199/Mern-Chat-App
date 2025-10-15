import React, { use, useState } from 'react';
import { Input,Flex,Box, Tooltip, Button,Text, Menu, MenuButton, MenuList,
Avatar,AvatarGroup ,MenuItem, MenuDivider, Drawer, DrawerOverlay,
 DrawerContent, DrawerHeader, DrawerBody,useToast,
 Spinner} from '@chakra-ui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
// import User from '../../../../backend/Models/userModel';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';
import { set } from 'mongoose';
import { getSender } from '../../config/ChatLogics';
import {Effect} from 'react-notification-badge'
import NotificationBadge from 'react-notification-badge'

export default function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
  const navigate=useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    navigate("/");
  }

  const handleSearch=async()=>{
    if(!search){
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
        setLoading(true);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
    }
}

  const accessChat=async(userId)=>{
    try {
        setLoadingChat(true);
        const config = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post('/api/chat', { userId }, config);
        if(!chats.find((c)=>c._id===data._id)) setChats([data,...chats]);//prepend the chat to chat array if not already present


        setLoadingChat(false);
        setSelectedChat(data);
        onClose();
    } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
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
        borderRadius="lg"
        >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
            <Button variant="ghost" onClick={onOpen}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <Text d={{ base: "none", md: "flex" }} px={4}>Search User</Text>
            </Button>
        </Tooltip>
            <Text fontSize="2xl" 
            fontFamily="Work sans" 
            fontWeight="bold" 
            border="2px solid black" 
            borderRadius="md" 
            px={3} 
            py={1}>Sam Aaka</Text>
            <div>
                <Menu>
                    <MenuButton p={1}>
                        <NotificationBadge 
                        count={notification.length}
                        effect={Effect.SCALE}/>
                        <BellIcon fontSize="2xl" m={1}/>  
                    </MenuButton>
                    <MenuList pl={2}>
                        {!notification.length && "No new messages"}
                        {notification.map((notif)=>(
                            <MenuItem key={notif._id} onClick={()=>{
                                setSelectedChat(notif.chat)
                                setNotification(notification.filter((n)=>n!==notif))
                            }}>
                                {notif.chat.isGroupChat
                                ?`New message in ${notif.chat.chatName}`:
                                `New message from ${getSender(user,notif.chat.users)}`}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
                <Menu>
                    <MenuButton as={Button} ml={1} rightIcon={<ChevronDownIcon />}>
                        <Avatar size="sm" name={user?.name} src={user?.pic} />
                    </MenuButton>
                    <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                    </MenuList>
                </Menu>
                
            </div>
        </Box>
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
            <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                <Box display="flex" pb={2}  >
                    <input 
                        placeholder='Search by name or email'
                        mr={2}
                        value={search}
                        onChange={(e)=>setSearch(e.target.value)} 
                        style={{flex:1, padding:"5px"}}

                    />
                    <Button ml={1} onClick={handleSearch} colorScheme='teal'>
                        Go
                    </Button>
                </Box>
                {loading ?<ChatLoading />
                 : (
                    searchResult?.map((user)=>(
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={()=>accessChat(user._id)}
                    
                        />
                        ))
                    )
                }
                {loadingChat && <Spinner ml="auto" d="flex" /> }
                </DrawerBody>
            </DrawerContent> 
            
        </Drawer>
    </>
  );
}
