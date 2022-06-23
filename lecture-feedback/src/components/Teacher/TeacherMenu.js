import React, {useState, useEffect} from 'react'
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box, Switch, Select} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from "react-router-dom";


export const TeacherMenu= ({isAuth, setAuth}) => {
  const [visible, setVisible] = useState(false)
  const [code, setCode] = useState("")

  let navigate = useNavigate();

  useEffect(() => {
    fetch("/api/get-active-code")
    .then(res => res.json())
    .then(data => {
        if (data["code"] !== "none") {
          setCode(data["code"])
        }
        setVisible(true)
    })
  }, [])

  function handleStartPresentation() {
    fetch("/api/new-code")
    .then(res => res.json())
    .then(data => {
      navigate("/teacher/meeting/" + data.code, { replace: true })
    })
  }

  // Called when there is already an active presentation
  function handleOpenPresentation() {
    navigate("/teacher/meeting/" + code, { replace: true })
  }

  return (
    <ChakraProvider theme={theme}>
    {visible ?
    <Stack>
      <Header isAuth={isAuth} setAuth={setAuth}/>
      <VStack spacing="20px" marginTop="10px">
        <Heading>Teacher Menu</Heading>
        { code === "" 
        ? <Button onClick={handleStartPresentation} colorScheme='blue' size='lg'>Start Presentation</Button>
        : <Button onClick={handleOpenPresentation} colorScheme='blue' size='lg'>Open Presentation</Button> 
        }
        <NavButton colorScheme='blue' size='lg' dst="/teacher/analysis" name = "Past Presentation Analysis"></NavButton>
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
    : null}
  </ChakraProvider>
  )
}