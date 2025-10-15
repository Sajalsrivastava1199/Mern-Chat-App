import React, { useEffect,useState } from 'react'
import axios from 'axios'
import { ChatState } from '../Context/ChatProvider.jsx'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer.jsx'
import MyChats from '../components/MyChats.jsx'
import ChatBox from '../components/ChatBox.jsx'

export default function Chatpage() {
  const {user}=ChatState();
  const [fetchAgain,setfetchAgain]=useState(false)
  return <div style={{width:"100%"}}>
    {user && <SideDrawer/>}
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      height="91.5vh"
      padding="10px"
    >
      {user && <MyChats fetchAgain={fetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>}
    </Box>

  </div>
}
