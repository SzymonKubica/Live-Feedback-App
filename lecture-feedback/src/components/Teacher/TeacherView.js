import React, { useState, useEffect } from "react"
import {
  Box,
  ChakraProvider,
  Heading,
  Stack,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { Flex, Spacer } from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import TeacherHeader from "./TeacherHeader"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import CommentLog from "./CommentLog"
import { Reaction, getString } from "../Reactions"
import TeacherGraph from "./TeacherGraph"
import TeacherGraph2 from "./TeacherGraph2"

export const TeacherView = () => {
  const [studentCounter, setStudentCounter] = useState(0)

  useEffect(() => {
    socket.on("update students connected", data => {
      setStudentCounter(data.count)
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }

    fetch("/api/student-count", requestOptions)
      .then(res => res.json())
      .then(data => {
        setStudentCounter(data.count)
      })

    // Disconnect when unmounts
    return () => socket.off("update students connected")
  }, [])

  return (
    <ChakraProvider>
      <SocketContext.Provider value={socket}>
        <TeacherHeader />
        <Grid templateColumns="repeat(2, 1fr)" >
          <GridItem>
            <TeacherGraph2 />
          </GridItem>
          <GridItem>
            <CommentLog />
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
