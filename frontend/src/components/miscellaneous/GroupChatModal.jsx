import React,{useState} from 'react'
import { Box, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react'
import { IconButton,Button,Modal,ModalBody,ModalOverlay,ModalContent,ModalFooter,ModalCloseButton,ModalHeader, Image,Text } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserbadgeItem'

export default function GroupChatModal({children}){
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName]=useState("")
    const [selectedUsers,setSelectedUsers]=useState([])
    const [search,setSearch]=useState([])
    const [searchResult,setSearchResult]=useState([])
    const [loading,setLoading]=useState(false)
    const toast=useToast();

    const {chats,user,setChats}=ChatState() 
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
        }catch(erro){
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
    const handleSubmit=async()=>{
        if(!groupChatName||!selectedUsers){
            toast({
                title:"Please fill all the fields required",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
            return;
        }
        try{
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(
                "/api/chat/group",
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            )
            console.log(data)
            setChats([data,...chats])
            onClose()
            toast({
                title:"New Group created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"botton"
            })
        }catch(error){
            console.error("Group creation error:", error.response?.data || error.message);
            toast({
            title: "Failed to create group!",
            description: error.response?.data || "Unexpected error occurred.",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
            });
        }
    }
    const handleGroup=(usertobeadded)=>{
        if(selectedUsers.includes(usertobeadded)){
            toast({
                title:"User already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top"
            })
        }
        setSelectedUsers([...selectedUsers,usertobeadded]);
    }
    const handleDelete=(deluser)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id !== deluser._id))
    }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          d="flex" flexDir="column" alignItems="center">
            <FormControl>
                <Input 
                placeholder='Chat Name' 
                mb={3}
                onChange={(e)=>setGroupChatName(e.target.value)}/>
            </FormControl>
            <FormControl>
                <Input 
                placeholder='Add users eg: sam, john ' 
                mb={1}
                onChange={(e)=>handleSearch(e.target.value)}/>
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers.map((u)=>(
                    <UserBadgeItem 
                    key={u._id}
                    user={u}
                    handleFunction={()=>handleDelete(u)}/>)
                    )
                }
            </Box>
            {loading?<div>loading</div>:
            searchResult
            ?.slice(0,4).map((user)=>(
                <UserListItem key={user._id} 
                user={user} 
                handleFunction={()=>handleGroup(user)}/>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

