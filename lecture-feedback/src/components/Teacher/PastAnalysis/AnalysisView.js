import React, { useEffect, useState } from "react"
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center, Input, Box, Container, Flex } from "@chakra-ui/react"
import LectureAnalysisGraph from "../LectureAnalysisGraph"
import { useViewport } from "../../../hooks/useViewport"
import Messages from "../Messages"
import { useParams, useNavigate } from "react-router-dom";


export const AnalysisView = () => {


  const playerRef = React.useRef();
  const videoUrl = "https://www.youtube.com/watch?v=IyD3ID3PlL4"

  const { width, height } = useViewport()

  let {code} = useParams()

  const [time, setTime] = useState(90)

  const [comments, setComments] = useState([{ comment: "hello", reaction: "chilling" }])
  const [startTime, setStartTime] = useState(0)
  const [link, setLink] = useState("")

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "room": code }),
  }

  useEffect(() => {
    fetch('/api/get-all-comments', requestOptions)
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
  }, [])

  //https://pro.panopto.com/Panopto/Pages/Embed.aspx?tid=ac005dfe-14fb-47f6-9ccc-aebb00a778ee

  const handleAddLink = () => {
    let link = prompt("Enter Panopto Link")
    link = link.replace("Viewer","Embed")
    setTime(0)
    setLink(link)

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ "room": code , "link":link}),
    }
    fetch('/api/set-video-link', requestOptions)
    .then(res => res.json())
    .then(data => {
    })

  }

  const test = () => {
    playerRef.current.seekTo(30, "seconds")
  }


  return (
    <ChakraProvider theme={theme}>
      <Flex>
        <Container maxW={width * 0.66} maxH={height * 0.76}>
          {link === "" ? 
          <Box height={height * 0.70} width={width * 0.60}>
            <Heading>No Video Saved</Heading>
            <Button onClick={handleAddLink}>Add Panopto Link</Button>
          </Box>
          :
          <iframe src={`${link}&autoplay=true&offerviewer=true&showtitle=true&showbrand=true&captions=false&start=${time}&interactivity=all`} height={height * 0.70} width={width * 0.60} allowfullscreen allow="autoplay"></iframe>
          }
          <LectureAnalysisGraph room={code} setTime={setTime} />
        </Container>
        <Flex w="100%" h="100%" justify="center" align="center">
          <Flex w={["100%", "100%", "40%"]} h="90%" flexDir="column">
            <Messages h="calc(40vh)" messages={comments} startTime={startTime} setTime={setTime}/>
          </Flex>
        </Flex>
      </Flex>
    </ChakraProvider>
  )
}
