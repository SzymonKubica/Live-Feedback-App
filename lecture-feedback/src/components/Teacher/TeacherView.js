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
} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import TeacherHeader from "./TeacherHeader"
import CommentLog from "./CommentLog"
import TeacherGraph2 from "./TeacherGraph2"
import TeacherGraph3 from "./TeacherGraph3"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import { getString, Reaction } from "../Reactions"
import { useParams } from "react-router-dom"

export const TeacherView = ({isAuth, setAuth}) => {
  const [studentCounter, setStudentCounter] = useState(0)
  const [chartView, setChartView] = useState(0)

  let { code } = useParams()

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
        <TeacherHeader isAuth={isAuth} setAuth={setAuth} state={chartView} setState={setChartView} />
        <Heading textAlign="center">Reaction Analysis</Heading>
        <Heading textAlign="center"> Code: {code} </Heading>
        <Grid templateColumns="repeat(2, 1fr)">
          <GridItem>
            {chartView == 0 ? (
              <TeacherGraph2 room={code} />
            ) : chartView == 1 ? (
              <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
                <Box width="100%">
                  <Stack spacing={20}>
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Good"
                      color="green"
                      reaction={getString(Reaction.GOOD)}
                      room={code}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Confused"
                      color="red"
                      reaction={getString(Reaction.CONFUSED)}
                      room={code}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Too Fast"
                      color="orange"
                      reaction={getString(Reaction.TOO_FAST)}
                      room={code}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Chilling"
                      color="twitter"
                      reaction={getString(Reaction.CHILLING)}
                      room={code}
                    />
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <TeacherGraph3 room={code} />
            )}
          </GridItem>
          <GridItem>
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
