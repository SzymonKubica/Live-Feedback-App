import React, {useState} from 'react'
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box, Switch, Select} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from "react-router-dom";


export const TeacherMenu= () => {
  const [uploadVisible, setUploadVisible] = useState(false)
  const [meetingCode, setMeetingCode] = useState("")
  const [videoLink, setVideoLink] = useState("")
  let navigate = useNavigate();
  const f = null;

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setVideoLink(inputValue)
}

  function generateMeetingCode() {
    fetch("/api/new-code")
    .then(res => res.json())
    .then(data => {
      navigate("/teacher/meeting/" + data.code, { replace: true })
      console.log("was called")
    })
  }
  function fileHandler(e) {
    console.log(e.target.files[0])
    f = e.target.files[0]
    // for teams need to abstact  start time from file name
    // for zoom need to abstact start time from folder name
  }
  
  return (
    <ChakraProvider theme={theme}>
    <Stack>
      <Header />
      <VStack spacing="20px" marginTop="10px">
        <Heading>Teacher Menu</Heading>
        <Button onClick={generateMeetingCode} colorScheme='blue' size='lg'>Start Presentation</Button>
        <NavButton colorScheme='blue' size='lg' dst="student" name = "Past Presentation Analysis"></NavButton>
        {/* TODO: Add unique identifier to NavButton  */}
        <div/>
        <Heading>Settings</Heading>
        <Switch>Colour Blind Mode</Switch> 
        <Select placeholder = "Select 4th button option" width = "20%">
            <option>Too Slow</option>
            <option>Example Please</option>
            <option>Can you go back to:</option>
            <option>I can't hear</option>
            <option>I can't see</option>
            <option>Technical difficulties</option> 
            <option>Other</option> 
        </Select>
        <Input placeholder='Specify if Other' size = 'md' width = "20%" />
      </VStack>
    </Stack>
  </ChakraProvider>
  )
}
