import React from 'react'

import { FormControl, FormLabel, Input, VStack ,
    InputGroup,
    InputRightElement,
    Button,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const toast=useToast();
    const [loading,setLoading] = useState(false);
    const history = useHistory();
    //Submit Handler function


  const submitHandler = async () => {
    setLoading(true);
    // e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Empty Fields",
        description: "Please Fill all the Fields",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );
      // console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Login Successful",
        description: "You are successfully logged in",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Invalid Credentials",
        description: "Please Enter Valid Credentials",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  function handleClick() {
    setShow(!show);
  }
  return (
    
    <VStack spacing="4px">
      <FormControl id="lemail" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl id="lpassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitHandler();
              }
            }}
          />
          <InputRightElement p={4}>
            <Button
              h="1.75rem"
              m={5}
              padding={5}
              size="sm"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      
      <Button colorScheme="blue" size="lg" width="100%" m={2} onClick={submitHandler}>
        Login
      </Button>
      <Button colorScheme="red" size="lg" width="100%" m={2}
            onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                    console.log(email,password);
                }
            }
      >
        Guest User
      </Button>
    </VStack>
  );
};
export default Login
