import React from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
const HomePage = () => {
  return (
    <Container maxW="xl" centerContent >
      <Box
        display="flex"
        padding="4"
        justifyContent={{ base: "center", md: "center" }}
        textAlign={{ base: "center", md: "center" }}
        p={3}
        // bg={"whiteAlpha.100"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="xl"
        // bw: 2px
      >
        <Text fontSize="4xl" textColor={"white"}>
          Welcome to the{" "}
          <Text
            bgGradient="linear(to-l, blue.100, cyan.500)"
            bgClip="text"
            fontSize="6xl"
            fontWeight="extrabold"
          >
            ChatSync
          </Text>
        </Text>
      </Box>
      <Box
        bg="whiteAlpha.200"
        w="100%"
        p={4}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" color={"white"}>
              Login
            </Tab>
            <Tab width="50%" color={"white"}>
              {" "}
              Sign Up
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
