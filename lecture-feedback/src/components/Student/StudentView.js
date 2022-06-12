import React, { useState, useEffect } from "react"

import { ChakraProvider, Stack, theme } from "@chakra-ui/react"

import { socket } from "../../context/socket"
import Header from "../Header"
import StudentFeedbackGrid from "./StudentFeedbackGrid"

const NilReaction = "nil"

export const StudentView = () => {
  const [selectedReaction, setSelectedReaction] = useState(NilReaction)

  // reset the button when lecturer creates a snapshot
  useEffect(() => {
    socket.on("reset buttons", () => {
      setSelectedReaction(NilReaction)
    })

    // Disconnect when unmounts
    return () => socket.off("reset buttons")
    //
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <Stack width="100%">
        <Header />

        <StudentFeedbackGrid
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
      </Stack>
    </ChakraProvider>
  )
}
