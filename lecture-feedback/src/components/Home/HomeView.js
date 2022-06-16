import React, {useState} from 'react'

import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box, Text} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from 'react-router-dom'


export const HomeView = () => {
  const [joinVisible, setJoinVisible] = useState(false)
  const [validCode, setValidCode] = useState(true) // true when student input code does not exist
  const [code, setCode] = useState("")

  let navigate = useNavigate()

  async function handleJoin() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({"code": parseInt(code)}) 
    }
    
    const response = await fetch("/api/is-code-active", requestOptions)
    const data = await response.json();
    setValidCode(data.valid)
    if (data.valid) {
      navigate("/student/meeting/" + code, { replace: true })
    }
    
  }

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setCode(inputValue)
}
  
  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Home</Heading>
          <Button
            colorScheme='blue' 
            size="lg"
            onClick = {() => setJoinVisible(!joinVisible)}>Student</Button>
         {joinVisible ? <Box>
        <Center >
          <Input placeholder='Enter code to Join' size = 'sm' onChange={handleInputChange}/>
        </Center >
          <Button colorScheme='blue' size='sm' onClick={handleJoin}>Join</Button>
          {!validCode ? 
            <Text fontSize='sm' color = "red" > Error: Invalid Code </Text>
          :null}
       </Box> : null}
          <NavButton
            name="Teacher"
            dst="teacher/login"
            size="lg"
          />
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
