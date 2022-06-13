import React, { useState, useEffect } from "react"

import { Box, Center, ChakraProvider, Flex, Heading, Spacer, Stack } from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket";
import TeacherHeader from "./TeacherHeader"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import { Reaction, getString } from "../Reactions"
import TeacherGraph from './TeacherGraph'

export const TeacherView = () => {
  const [studentCounter, setStudentCounter] = useState(0)

  useEffect(() => {
    socket.on("update students connected", data => {
      setStudentCounter(data.count)
    })

    const requestOptions = {
      'method': 'POST',
      'headers': { 'Content-Type': 'application/json' },
    }

    fetch('/api/student-count', requestOptions)
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
        <Flex height='calc(85vh)' width='100%'>
          <TeacherGraph
            series={[1, 2, 3, 4]}
            labels={['Confused', 'Good', 'Too Fast', 'Chilling']}
            colors={['red', 'green', 'orange', 'blue']}
            colorblind={false} />
        </Flex>

        <Flex>
          <Spacer />
          <Heading>{studentCounter} students</Heading>
        </Flex>

      </SocketContext.Provider>
    </ChakraProvider>
  )
}
