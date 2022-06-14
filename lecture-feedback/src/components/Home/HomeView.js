import React, {useState} from 'react'

import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from 'react-router-dom'


export const HomeView = () => {
  const [joinVisible, setJoinVisible] = useState(false)
  const [code, setCode] = useState("")

  let navigate = useNavigate()

  function handleJoin() {
    navigate("/student/meeting/" + code, { replace: true })
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
        
       </Box> : null}
          <NavButton
            name="Teacher"
            dst="teacher/menu"
            size="lg"
          />
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
