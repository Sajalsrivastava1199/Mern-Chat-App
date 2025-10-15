import React, { useState } from 'react'

import {
  Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,
  ModalCloseButton,Button,
  IconButton,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  Input,
  position,
  Spinner
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons'
import { ChatState } from '../../Context/ChatProvider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import { isCSSVariableName } from 'framer-motion'

export default function UpdateGroupChatModal({fetchAgain,setfetchAgain,fetchMessages}){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState("")
    const [search,setSearch]=useState("")
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const [renameloading,setRenameloading]=useState(false)

    const toast=useToast()
    const handleRemove=async(user1)=>{
        if(selectedChat.groupAdmin._id !==user._id && user1._id !== user._id){
            toast({
                title:"Only Admins can remove",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        try{
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.put('/api/chat/groupremove',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)

            user1._id===user._id?setSelectedChat():setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
            
        }catch(error){
            console.error("Rename Error:", error);
            toast({
                title:"Error Occured!!",
                description:
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while renaming the group.",
                status:"error",
                duration:"5000",
                isClosable:true,
                position:"bottom"
            })
        }
    }
    const handleAddUser=async(user1)=>{
        if(selectedChat.users.find((u)=>u._id===user1._id)){
            toast({
                title:"User Already present in group",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        if(selectedChat.groupAdmin._id!==user._id){
            faTachometerAltFast({
                title:"Only admins can add in group!!!",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom"
            })
            return
        }
        try{
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}= await axios.put('/api/chat/groupadd',{
                chatId:selectedChat._id,
                userId:user1._id
            },config)

            setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            setLoading(false)
            
        }catch(error){
            console.error("Rename Error:", error);
            toast({
                title:"Error Occured!!",
                description:
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while renaming the group.",
                status:"error",
                duration:"5000",
                isClosable:true,
                position:"bottom"
            })
        }
    }
    const handleRename=async()=>{
        if(!groupChatName)
            return
        try{
            setRenameloading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.put("/api/chat/rename",{
                chatId:selectedChat._id,
                chatName:groupChatName
            },config)
            setSelectedChat(data)
            setfetchAgain(!fetchAgain)
            setRenameloading(false)
        }catch(error){

            console.error("Rename Error:", error);
            toast({
                title:"Error Occured!!",
                description:
                error.response?.data?.message ||
                error.message ||
                "Something went wrong while renaming the group.",
                status:"error",
                duration:"5000",
                isClosable:true,
                position:"bottom"
            })
            setRenameloading(false)
        }
        setGroupChatName("")
    }
    const handleSearch=async(query)=>{
        setSearch(query)
        if(!query){
            return;
        }
        try{
            setLoading(true)
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const {data}=await axios.get(`/api/user?search=${search}`,config)
            console.log(data)
            setLoading(false)
            setSearchResult(data)
        }catch(error){
            toast({
                title:"Error occured!",
                description:"Failed to load the search results",
                status:"error",
                duration:5000,
                isClosable:true,
                position:"bottom left"
            })
        }
    }

    const {selectedChat,setSelectedChat,user}=ChatState()
  return (
    <>
      <IconButton d={{base:"flex"}} icon={<ViewIcon />} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center">{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                {selectedChat.users.map(u=>(
                    <UserBadgeItem 
                        key={u._id}
                        user={u}
                        handleFunction={()=>handleRemove(u)}/>
                ))}
            </Box>
            <FormControl display="flex">
                <Input
                placeholder='Chat Name'
                mb={3}
                value={groupChatName}
                onChange={(e)=>setGroupChatName(e.target.value)}/>
                <Button
                variant="solid"
                colorScheme='teal'
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}>
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input
                placeholder='Add User to group'
                mb={1}
                onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            {loading?(<Spinner size='lg'/>):(
                searchResult.map((user)=>(
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleAddUser(user)} />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={()=>handleRemove(user)} colorScheme='red'>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
