import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import SingleChat from './SingleChat'

export default function ChatBox({fetchAgain,setfetchAgain}){
  const {selectedChat,setSelectedChat} = ChatState()
  return (
    <Box d={{base:selectedChat?"flex":"none",md:"flex"}}
    alignItems="center"
    flexDir="column"
    p={3}
    bg="white"
    w={{base:"100%",md:"68%"}}
    borderRadius="lg"
    borderWidth="1px"
    border="2px solid black"
    h="100%">
      <SingleChat fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
    </Box>
  )
}