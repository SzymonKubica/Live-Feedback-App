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

export const TeacherView = () => {
  const [studentCounter, setStudentCounter] = useState(0)
  const [layout, setLayout] = useState(true)

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
        <TeacherHeader state={layout} setState={setLayout} />
        <Grid templateColumns="repeat(2, 1fr)">
          <GridItem>
            {layout == 0 ? (
              <TeacherGraph2 />
            ) : layout == 1 ? (
              <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
                <Box width="100%">
                  <Stack spacing={20}>
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Good"
                      color="green"
                      reaction={getString(Reaction.GOOD)}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Confused"
                      color="red"
                      reaction={getString(Reaction.CONFUSED)}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Too Fast"
                      color="orange"
                      reaction={getString(Reaction.TOO_FAST)}
                    />
                    <TeacherFeedbackBar
                      studentCount={studentCounter}
                      title="Chilling"
                      color="twitter"
                      reaction={getString(Reaction.CHILLING)}
                    />
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <TeacherGraph3 />
            )}
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
