import React, {useState, useEffect} from 'react'
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box, Switch, Select} from "@chakra-ui/react"
import NavButton from "../NavButton"
import Header from "../Header"
import { useNavigate } from "react-router-dom"
import { socket, SocketContext } from "../../context/socket"


export const TeacherMenu= ({isAuth, setAuth}) => {
  const [visible, setVisible] = useState(false)
  const [code, setCode] = useState("")
  const [customReaction, setCustomReaction] = useState("Too Slow")
  const [otherSelected, setOtherSelected] = useState(false)


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
        socket.emit("set custom reaction", data.code, customReaction)
      })
  }

  // Called when there is already an active presentation
  function handleOpenPresentation() {
    navigate("/teacher/meeting/" + code, { replace: true })
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
    if (e.target.value === "Other"){
      setOtherSelected(true)
    }
  }

  return (
    <ChakraProvider theme={theme}>
      {visible ?
      <Stack>
        <Header isAuth={isAuth} setAuth={setAuth} />
        <VStack spacing="20px" marginTop="10px">
          <Heading>Teacher Menu</Heading>
          {code === "" 
          ? <Button onClick={handleStartPresentation} colorScheme='blue' size='lg'>Start Presentation</Button>
          : <Button onClick={handleOpenPresentation} colorScheme='blue' size='lg'>Open Presentation</Button> 
          }
          <NavButton
            colorScheme="blue"
            size="lg"
            dst="/teacher/analysis"
            name="Past Presentation Analysis"
          ></NavButton>
          {/* TODO: Add unique identifier to NavButton  */}
          <Heading>Settings</Heading>
          <Switch>Colour Blind Mode</Switch>
          <SocketContext.Provider>
            <Box>
            <Select
              placeholder="Select 4th button option"
              width="100%"
              onChange={handleChange}
            >
              {options.map(option => (
                <option value={option}> {option} </option>
              ))}
            </Select>
            { otherSelected
              ? <Input placeholder='Enter Custom Reaction' onChange={(e) => setCustomReaction(e.target.value)}></Input>
              : null
            }
            </Box>
          </SocketContext.Provider>
        </VStack>
      </Stack>
      : null }
    </ChakraProvider>
  )
}
