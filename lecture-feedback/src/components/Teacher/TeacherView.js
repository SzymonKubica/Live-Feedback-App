import React, { useState, useEffect } from "react"

import {
  Box,
  Center,
  ChakraProvider,
  Flex,
  Heading,
  Spacer,
  Stack,
} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import TeacherHeader from "./TeacherHeader"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import { Reaction, getString } from "../Reactions"
import TeacherGraph from "./TeacherGraph"

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
        <Flex height="calc(85vh)" width="100%">
          <TeacherGraph
            labels={["Good", "Confused", "Too Fast", "Chilling"]}
            colors={["green", "red", "orange", "blue"]}
            colorblind={false}
          />
          <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
            <Box width="60%">
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
            {/* <SocketCounter reaction="students connected"/> */}
            <Heading alignSelf="end">{studentCounter} students</Heading>
          </Stack>
        </Flex>
        <Flex>
          <Spacer />
          <Heading>{studentCounter} students</Heading>
        </Flex>
      </SocketContext.Provider>
    </ChakraProvider>
  )
}
