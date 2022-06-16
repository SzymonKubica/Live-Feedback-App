import React, { useState, useEffect } from "react"

import {
  Box,
  ChakraProvider,
  Heading,
  Stack,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Container,
  Center,
} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import { useViewport } from "../../hooks/useViewport"
import TeacherHeader from "./TeacherHeader"
import CommentLog from "./CommentLog"
import TeacherGraph2 from "./TeacherGraph2"
import TeacherGraph3 from "./TeacherGraph3"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import { useParams } from "react-router-dom";
import TeacherBars from "./TeacherBars"

export const TeacherView = () => {
  const [studentCounter, setStudentCounter] = useState(0)
  const [chartView, setChartView] = useState(0)
  const { width, height } = useViewport()

  let { code } = useParams();

  useEffect(() => {
    socket.on("update students connected", data => {
      setStudentCounter(data.count)
    })
    socket.emit("join", { room: code, type: "teacher" })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: code }),
    }

    fetch("/api/student-count", requestOptions)
      .then(res => res.json())
      .then(data => {
        setStudentCounter(data.count)
      })

    // Disconnect when unmounts
    return () => {
      socket.off("update students connected")
      socket.emit("leave", { room: code })
    }
  }, [])

  return (
    <ChakraProvider>
      <SocketContext.Provider value={socket}>
        <TeacherHeader state={chartView} setState={setChartView} />
        <Heading textAlign='center'>Reaction Analysis</Heading>
        <Heading textAlign='center'> Code: {code} </Heading>
        <Grid templateColumns="repeat(3, 1fr)" height='calc(78vh)'>
          <GridItem rowSpan={2} colSpan={2}>
            <Container maxW='100%' id="graphsDiv">
              {chartView == 0 ? (
                <Container maxW={Math.min(0.66 * width, 0.78 *height)}>
                    <TeacherGraph2 room={code} />
                </Container>
              ) : chartView == 1 ? (
                <TeacherBars studentCounter={studentCounter} code={code} />
              ) : (
                <Container maxW={width*0.66} maxH={height*0.78}>
                
                <TeacherGraph3 />
                </Container>
              )}
            </Container>
          </GridItem>
          <GridItem rowSpan={2}>
            {/* TODO: add get code button */}
            <CommentLog room={code} />
          </GridItem>
        </Grid>

        <Flex>
          <Spacer />
          <Heading>{studentCounter} students</Heading>
        </Flex>
      </SocketContext.Provider>
    </ChakraProvider>
  )
}
