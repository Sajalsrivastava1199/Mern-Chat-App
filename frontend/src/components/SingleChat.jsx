import React, { useState, useEffect } from 'react';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { Box, FormControl, Input, IconButton, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getfullSender } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';
import Lottie from 'react-lottie'
import animationData from "../animations/typing.json"

const ENDPOINT = 'http://localhost:5000';
let socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setfetchAgain }) {
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing,setTyping]=useState(false)
  const [isTyping,setIsTyping]=useState(false)
  const toast = useToast();

  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
        preserveAspectRatio:"xMidyMid slice"
    }
  }

  // Fetch messages for the selected chat
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);

      // Join socket room after fetching messages
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Error Occured!!',
        status: 'error',
        description: 'Failed to load messages',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT, { transports: ['websocket'] });
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));


    return () => socket.disconnect();
  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    
  }, [selectedChat]);

//   console.log(notification,"==><==<>==<>==><==")

  // Listen for incoming messages
  useEffect(() => {
    socket.on('message recieved', (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
        // optional: show notification for other chats
        if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved,...notification])
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
        setfetchAgain(!fetchAgain)
      }
    });

    return () => socket.off('message recieved');
  }, []);

  // Send message
  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` } };
        setNewMessage('');
        const { data } = await axios.post('/api/message', { content: newMessage, chatId: selectedChat._id }, config);
        setMessages((prevMessages) => [...prevMessages, data]);
        socket.emit('new message', data);
      } catch (error) {
        toast({
          title: 'Error Occured!!',
          status: 'error',
          description: 'Failed to send the message',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //typing indicator loguic
    if(!socketConnected) return

    if(!typing){
        setTyping(true)
        socket.emit("typing",selectedChat._id)
    }

    let lastTypingTime=new Date().getTime()
    var timerlength=3000
    setTimeout(()=>{
        var timenow=new Date().getTime()
        var timediff=timenow-lastTypingTime

        if(timediff>=timerlength && typing){
            socket.emit("stop typing",selectedChat._id)
            setTyping(false)
        }
    },timerlength)

   }
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
          >
            <IconButton display={{ base: 'flex', md: 'none' }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat('')} />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getfullSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setfetchAgain={setfetchAgain} fetchMessages={fetchMessages} />
              </>
            )}
          </Text>

          <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#e8e8e8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
            {loading ? (
              <Spinner size="xl" w={35} h={35} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping?
              <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
                <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                />
                </div>:<></>}  
              <Input variant="filled" bg="#a9a0a091" placeholder="Enter message" onChange={typingHandler} value={newMessage} />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start conversation
          </Text>
        </Box>
      )}
    </>
  );
}
