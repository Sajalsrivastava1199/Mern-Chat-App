import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack ,useToast} from '@chakra-ui/react'
import { set } from 'mongoose';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
const[name,setName]= useState("");
const[email,setEmail]= useState("");
const[password,setPassword]= useState("");
const[confirmpassword,setConfirmpassword]= useState("");
const [pic,setPic]= useState(null);
const [showpass,setshowpass]= useState(false);
const [showcnfpass,setshowcnfpass]= useState(false);
const passhandleclick = () => setshowpass(!showpass);
const cnfpasshandleclick = () => setshowcnfpass(!showcnfpass);
const [loading,setLoading]= useState(false);
const toast = useToast();
const navigate = useNavigate();

    
const postDetails = (pics) => {
    setLoading(true);
    if(pics===undefined){
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    if(pics.type==="image/jpeg" || pics.type==="image/png"){
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset","chat-app");
        data.append("cloud_name","dolbd3dip");  
        console.log("Fist log",data);
        fetch("https://api.cloudinary.com/v1_1/dolbd3dip/image/upload",{
            method:"post",
            body:data,
        }).then((res)=>res.json())
        .then((data)=>{
            console.log("Full response",data);
            setPic(data.url.toString());
            console.log("Uploaded image URL",data.url.toString());
            console.log("Uploaded image secureURL",data.secure_url.toString());
            setLoading(false);
        })
        .catch((err)=>{
            console.log(err);
            setLoading(false);
        })
    }else{
        toast({
            title: "Please Select an Image!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
    }
}
const submitHandler = async() => {
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
        toast({
            title: "Please Fill all the Fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
    }
    if(password !== confirmpassword){
        toast({
            title: "Passwords Do Not Match",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/user", { name, email, password, pic }, config);
      console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="5px" color="black">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
            placeholder="Enter Your Name" 
            onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
            placeholder="Enter Your Email" 
            onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Enter Password</FormLabel>
        <InputGroup>
            <Input
            type={showpass?"text":"password"}
            placeholder="Enter Password" 
            onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={(passhandleclick)}>
                    {showpass?"Hide":"Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel> 
        <InputGroup>
            <Input
            type={showcnfpass?"text":"password"}
            placeholder="Confirm Password" 
            onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={(cnfpasshandleclick)}>
                    {showcnfpass?"Hide":"Show"}
                </Button>
            </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
            type="file"
            p={1.5}
            accept="image/*"    
            onChange={(e) => postDetails(e.target.files[0])}
        />
       </FormControl>
       <Button
            colorScheme="blue"
            width="100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>
      
    </VStack>
  )
}
