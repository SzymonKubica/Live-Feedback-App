import React, {useEffect, useState} from "react"
import { ChakraProvider, theme, VStack, Heading, Stack, Button, Center , Input, Box, Container} from "@chakra-ui/react"
import LectureAnalysisGraph from "../LectureAnalysisGraph"
import { useViewport } from "../../../hooks/useViewport"


export const AnalysisView = () => {


  const playerRef = React.useRef();
  const videoUrl = "https://www.youtube.com/watch?v=IyD3ID3PlL4"

  const { width, height } = useViewport()

  const code = "248191"

  const [time, setTime] = useState(90)

  // const onReady = React.useCallback(() => {
  //   const timeToStart = (7 * 60) + 12.6;
  //   playerRef.current.seekTo(timeToStart, 'seconds');
  // }, [playerRef.current]);

  const test = () => {
    playerRef.current.seekTo(30, "seconds")
  }


  return (
    <ChakraProvider theme={theme}>
        <Container maxW={width * 0.66} maxH={height * 0.76}>
        <iframe src={`https://pro.panopto.com/Panopto/Pages/Embed.aspx?tid=ac005dfe-14fb-47f6-9ccc-aebb00a778ee&autoplay=true&offerviewer=true&showtitle=true&showbrand=true&captions=false&start=${time}&interactivity=all`} height="405" width="720" allowfullscreen allow="autoplay"></iframe>
        <LectureAnalysisGraph room={code} setTime={setTime}/>
        </Container>
    </ChakraProvider>
  )
}