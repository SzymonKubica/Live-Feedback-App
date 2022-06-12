import { Box, ChakraProvider, Heading, Stack } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
import TeacherHeader from "./TeacherHeader"
import socket from "../context/socket"
import TeacherFeedbackBar from "./TeacherFeedbackBar"

export const TeacherView = () => {
  const [studentCounter, setStudentCounter] = useState(0)

  useEffect(() => {
    socket.on("update students connected", data => {
      setStudentCounter(data.count)
    })

    // Disconnect when unmounts
    return () => socket.off("update students connected")
  }, [])

  return (
    <ChakraProvider>
      <TeacherHeader />
      <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
        <Box width="60%">
          <Stack spacing={20}>
            <TeacherFeedbackBar
              studentCount={studentCounter}
              title="Good"
              color="green"
              reaction="good"
            />
            <TeacherFeedbackBar
              studentCount={studentCounter}
              title="Confused"
              color="red"
              reaction="confused"
            />
            <TeacherFeedbackBar
              studentCount={studentCounter}
              title="Too Fast"
              color="orange"
              reaction="too-fast"
            />
            <TeacherFeedbackBar
              studentCount={studentCounter}
              title="Chilling"
              color="twitter"
              reaction="chilling"
            />
          </Stack>
        </Box>
        {/* <SocketCounter reaction="students connected"/> */}
        <Heading alignSelf="end">{studentCounter} students</Heading>
      </Stack>
    </ChakraProvider>
  )
}
