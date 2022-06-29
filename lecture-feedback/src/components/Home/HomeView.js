import React, { useState } from "react"

import {
  ChakraProvider,
  theme,
  VStack,
  Heading,
  Stack,
  Button,
  Center,
  Input,
  Box,
  Text,
  Link,
  SimpleGrid
} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import {Routes, Route, useNavigate} from 'react-router-dom'
import student from "../../public/student.png"
import lecturer from "../../public/lecturer.png"

export const HomeView = () => {
  const [joinVisible, setJoinVisible] = useState(false)
  const [validCode, setValidCode] = useState(true) // true when student input code does not exist
  const [code, setCode] = useState("")

  let navigate = useNavigate()

  async function handleJoin() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: code }),
    }

    const response = await fetch("/api/is-code-active", requestOptions)
    const data = await response.json()
    setValidCode(data.valid)
    if (data.valid) {
      navigate("/student/meeting/" + code, { replace: true })
    }
  }

  const handleInputChange = (e) => {
    let inputValue = e.target.value
    setCode(inputValue)
  }

  const handleKeypress = (e) => {
    // If enter is pressed
    let code = (e.keyCode ? e.keyCode : e.which)
    if (code === 13) {      
      handleJoin()   
    }
  }
  const navigateTeacher = () => {
    navigate("teacher/login");
  };
  
  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Home</Heading>
          <Center width="100%" height="calc(60vh)">
        <SimpleGrid marginBlock="5%" width="90%" height="90%" columns="2">
        <Button height = "100%" 
        colorScheme="blue"
        size="lg"
        onClick={() => setJoinVisible(!joinVisible)}>
          <Box><img src={student}/> <Heading color = "black">Student</Heading></Box>
          </Button>
          {/* <Link to= "teacher/login" width = "100%"> */}
        <Button height = "100%" colorScheme= "cyan" onClick={navigateTeacher}><Box><img src={lecturer} /> <Heading>Teacher</Heading></Box></Button>
        {/* <NavButton></NavButton> */}
        {/* </Link> */}
        </SimpleGrid>
        
        </Center>
        {joinVisible ? (
            <Box>
              <Center>
                <Input
                  placeholder="Enter code to Join"
                  size="sm"
                  onChange={handleInputChange}
                />
              </Center>
              <Button colorScheme="blue" size="sm" onClick={handleJoin}>
                Join
              </Button>
              {!validCode ? (
                <Text fontSize="sm" color="red">
                  {" "}
                  Error: Invalid Code{" "}
                </Text>
              ) : null}
            </Box>
          ) : null}
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
