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
  }, [])




  // const onReady = React.useCallback(() => {
  //   const timeToStart = (7 * 60) + 12.6;
  //   playerRef.current.seekTo(timeToStart, 'seconds');
  // }, [playerRef.current]);

  const test = () => {
    playerRef.current.seekTo(30, "seconds")
  }


  return (
    <ChakraProvider theme={theme}>
      <Flex>
        <Container maxW={width * 0.66} maxH={height * 0.76}>
          <iframe src={`https://pro.panopto.com/Panopto/Pages/Embed.aspx?tid=ac005dfe-14fb-47f6-9ccc-aebb00a778ee&autoplay=true&offerviewer=true&showtitle=true&showbrand=true&captions=false&start=${time}&interactivity=all`} height="405" width="720" allowfullscreen allow="autoplay"></iframe>
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
