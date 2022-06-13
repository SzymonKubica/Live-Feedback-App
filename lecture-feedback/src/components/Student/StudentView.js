import React, { useState, useEffect } from "react"

import { ChakraProvider, Stack, theme, Textarea} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import Header from "../Header"
import StudentFeedbackGrid from "./StudentFeedbackGrid"
import CommentSection from "./CommentSection"

const NilReaction = "nil"

export const StudentView = () => {
  const [selectedReaction, setSelectedReaction] = useState(NilReaction)

  // reset the button when lecturer creates a snapshot
  useEffect(() => {
    socket.on("reset buttons", () => {
      setSelectedReaction(NilReaction)
    })

    socket.emit("join", {"room":"student"})

    // Disconnect when unmounts
    return () => {
      socket.off("reset buttons")
      socket.emit("leave", {"room":"student"})
    }
    //
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={socket}>      
        <Stack width="100%">
          <Header />

          <StudentFeedbackGrid
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
          />
         <CommentSection />
        </Stack>
      </SocketContext.Provider>
    </ChakraProvider>
  )
}
