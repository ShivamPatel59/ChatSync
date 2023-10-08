import React from "react";
import { FormControl, FormLabel, Input, VStack ,
    InputGroup,
    InputRightElement,
    Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

// import { set } from "mongoose";
const Signup = () => {
  const toast=useToast();
    const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [pic, setPic] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();
  
    //Submit Handler function

    const submitHandler = async() => {
        setLoading(true);
        // e.preventDefault();

        if(!name || !email || !password || !confirmPassword){
            toast({
                title: "Empty Fields",
                description: "Please Fill all the Fields",
                status: "warning",
                duration: 9000,
                isClosable: true,
                position: "bottom"
              });
              setLoading(false);
              return;
        }
        if(password!==confirmPassword){
            toast({
                title: "Password Mismatch",
                description: "Please Enter Same Password in both the Fields",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom"
              });
              setLoading(false);
              return;
        }

        try{
          const config={
            headers:{
              "Content-Type":"application/json"
            }
          };
          const { data } = await axios.post(
            "http://localhost:5000/api/user",
            { name, email, password, pic },
            config
          );
          toast({
            title: "User Created",
            description: "User Created Successfully",
            status: "success",
            duration: 9000,
            isClosable: true,
            position: "bottom"
          });
          localStorage.setItem("userInfo",JSON.stringify(data));
          setLoading(false);
          history.push("/chats");
          window.location.reload();
        }
        catch(err){
            toast({
                title: "Invalid Credentials",
                description: "Please Enter Valid Credentials",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom"
              });
              setLoading(false);
              return;
        }
        
      };




    // postDetails function using fetch api 
    const postDetails = (pics) => {
        setLoading(true);
        if(pics===undefined){
            toast({
                title: "No Profile Picture Selected",
                description: "Please Select a Profile Picture",
                status: "error",
                duration: 9000,
                isClosable: true,
                position: "bottom"
              });
              return;
        }

        if(pics.type==="image/jpeg" || pics.type==="image/png"){
          // Upload to Cloudinary
          const data = new FormData();
          data.append("file", pics);
          data.append("upload_preset", "chatapp");
          data.append("cloud_name", "dq7i6llmw");

          fetch("https://api.cloudinary.com/v1_1/dq7i6llmw/image/upload", {
            method: "post",
            body: data,
          })
            .then((res) => res.json())
            .then((data) => {
              setPic(data.url.toString());
              setLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setLoading(false);
            });
        }
        else{
          toast({
            title: "Invalid File Type",
            description: "Please Select a Profile Picture of type jpeg or png",
            status: "error",
            duration: 9000,
            isClosable: true,
            position: "bottom"
          });
          setLoading(false);
        }
    };
    

  function handleClick() {
    setShow(!show);
  }
  return (
    <VStack spacing="4px">
      <FormControl id="first-name" isRequired>
        <FormLabel>First Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement p={4}>
            <Button
              h="1.75rem"
              m={4}
              padding={5}
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement p={4}>
            <Button
              h="1.75rem"
              m={4}
              padding={5}
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Profile Picture</FormLabel>
        <Input
          type="file"
          p={2}
          border={2}
          placeholder="Enter your Profile Picture"
          
          onChange={(e) => postDetails(e.target.files[0])}
        /> 
      </FormControl>
      <Button colorScheme="blue" size="lg" width="100%" m={2}
      isLoading={loading}
      onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
