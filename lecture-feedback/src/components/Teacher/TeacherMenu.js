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
  Switch,
  Select,
} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from "react-router-dom"
import { socket, SocketContext } from "../../context/socket"

export const TeacherMenu = () => {
  const [uploadVisible, setUploadVisible] = useState(false)
  const [meetingCode, setMeetingCode] = useState("")
  const [videoLink, setVideoLink] = useState("")
  const [customReaction, setCustomReaction] = useState("No reaction")
  let navigate = useNavigate()
  let f = null

  let handleInputChange = e => {
    let inputValue = e.target.value
    setVideoLink(inputValue)
  }

  function generateMeetingCode() {
    fetch("/api/new-code")
      .then(res => res.json())
      .then(data => {
        navigate("/teacher/meeting/" + data.code, { replace: true })
        console.log(data.code)
        socket.emit("set custom reaction", data.code, customReaction)
        console.log("was called")
      })
  }
  function fileHandler(e) {
    console.log(e.target.files[0])
    f = e.target.files[0]
    // for teams need to abstact  start time from file name
    // for zoom need to abstact start time from folder name
  }
  const options = [
    "Too Slow",
    "Example Please",
    "Can you go back to:",
    "I can't hear",
    "I can't see",
    "Technical difficulties",
    "Other",
  ]

  function handleChange(e) {
    setCustomReaction(e.target.value)
  }

  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Teacher Menu</Heading>
          <Button onClick={generateMeetingCode} colorScheme="blue" size="lg">
            Start Presentation
          </Button>
          <NavButton
            colorScheme="blue"
            size="lg"
            dst="/teacher/analysis"
            name="Past Presentation Analysis"
          ></NavButton>
          {/* TODO: Add unique identifier to NavButton  */}
          <NavButton
            colorScheme="blue"
            size="lg"
            dst="review-feedback"
            name="Review Feedback"
          ></NavButton>
          <Switch>Colour Blind Mode</Switch>
          <SocketContext.Provider>
            <Select
              placeholder="Select 4th button option"
              width="20%"
              onChange={handleChange}
            >
              {options.map(option => (
                <option value={option}> {option} </option>
              ))}
            </Select>
          </SocketContext.Provider>
        </VStack>
      </Stack>
    </ChakraProvider>
  )
}
