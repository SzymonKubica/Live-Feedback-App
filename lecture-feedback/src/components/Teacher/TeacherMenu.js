import React, {useState} from 'react'
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from "react-router-dom";

export const TeacherMenu= ({isAuth, setAuth}) => {

  const [meetingCode, setMeetingCode] = useState("")
  let navigate = useNavigate();

  function generateMeetingCode() {
    fetch("/api/new-code")
    .then(res => res.json())
    .then(data => {
      navigate("/teacher/meeting/" + data.code, { replace: true })
      console.log("was called")
    })
  }
  
  return (
    <ChakraProvider theme={theme}>
    <Stack>
      <Header isAuth={isAuth} setAuth={setAuth} />
      <VStack spacing="20px" marginTop="10px">
        <Heading >Teacher Menu</Heading>
        <Button onClick={generateMeetingCode} colorScheme='blue' size='lg'>Start Presentation</Button>
        <NavButton colorScheme='blue' size='lg' dst="/teacher/analysis" name = "Past Presentation Analysis"></NavButton>
      </VStack>
    </Stack>
  </ChakraProvider>
  )
}