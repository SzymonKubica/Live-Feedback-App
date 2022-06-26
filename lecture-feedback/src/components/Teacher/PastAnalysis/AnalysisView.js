import React, { useEffect, useState } from "react"
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center, Input, Box, Container, Flex, Grid, GridItem, Spacer, Textarea, HStack, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react"
import LectureAnalysisGraph from "../LectureAnalysisGraph"
import { useViewport } from "../../../hooks/useViewport"
import Messages from "../Messages"
import { useParams, useNavigate } from "react-router-dom"
import Header from "../../Header"

export const AnalysisView = ({ isAuth, setAuth }) => {
  const playerRef = React.useRef()
  const videoUrl = "https://www.youtube.com/watch?v=IyD3ID3PlL4"

  const { width, height } = useViewport()

  let { code } = useParams()

  const [time, setTime] = useState(0)

  const [comments, setComments] = useState([
    { comment: "hello", reaction: "custom" },
  ])
  const [startTime, setStartTime] = useState(0)
  const [link, setLink] = useState("")
  const [customReaction, setCustomReaction] = useState("")

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room: code }),
  }

  useEffect(() => {
    fetch("/api/get-all-comments", requestOptions)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments)
      })

    fetch('/api/get-start-time', requestOptions)
      .then(res => res.json())
      .then(data => {
        setStartTime(data.time)
      })

    fetch('/api/get-video-link', requestOptions)
      .then(res => res.json())
      .then(data => {
        setLink(data.link)
      })

    fetch("/api/get-custom-reaction", requestOptions)
      .then(res => res.json())
      .then(data => {
        setCustomReaction(data.reaction)
      })
  }, [])

  //https://pro.panopto.com/Panopto/Pages/Embed.aspx?tid=ac005dfe-14fb-47f6-9ccc-aebb00a778ee

  const handleAddLink = () => {
    let link = prompt("Enter Panopto Link")
    link = link.replace("Viewer", "Embed")
    setTime(0)
    setLink(link)

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "room": code, "link": link }),
    }
    fetch('/api/set-video-link', requestOptions)
      .then(res => res.json())
      .then(data => {
      })

  }

  return (
    <ChakraProvider theme={theme}>
      {/* <Flex> */}
      <Header isAuth={isAuth} setAuth={setAuth} />
      <Grid templateColumns="repeat(3, 1fr)" templateRows="repeat(3, 1fr)" height="calc(85vh)">
        <GridItem rowSpan={2} colSpan={2}>
          <Container maxW={width * 0.55} maxH={height * 0.70}>
            {link === "" ?
              <Box height={height * 0.35} width={width * 0.55}>
                <Heading>No Video Saved</Heading>
                <Button onClick={handleAddLink}>Add Panopto Link</Button>
              </Box>
              :
              <iframe src={`${link}&autoplay=true&offerviewer=true&showtitle=true&showbrand=true&captions=false&start=${parseFloat(time) + parseFloat(document.getElementById("offset_num").value)}&interactivity=all`} height={height * 0.35} width={width * 0.55} allowFullScreen allow="autoplay"></iframe>
            }
          </Container>
        </GridItem>


        <GridItem rowSpan={2} colSpan={1}>
          <Flex w="100%" h="100%" justify="center" align="center">
            <Flex w='100%' h="90%" flexDir="column">
              <Messages
                h="calc(40vh)"
                messages={comments}
                startTime={startTime}
                setTime={setTime}
              />
            </Flex>
          </Flex>
        </GridItem>

        <GridItem rowSpan={1} colSpan={3}>
          <Container maxW={width}>

          <LectureAnalysisGraph room={code} customReaction={customReaction} setTime={setTime} />
          <HStack marginTop={5}>
            <Text >Offset (seconds): </Text>
            <NumberInput defaultValue={0} width='auto' id="offset_num">
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
          </Container>
        </GridItem>
      </Grid>
      {/* </Flex> */}
    </ChakraProvider>
  )
}
