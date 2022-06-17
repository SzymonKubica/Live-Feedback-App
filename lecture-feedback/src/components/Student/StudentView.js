import React, { useState, useEffect } from "react"

import { ChakraProvider, Stack, theme, Textarea, Heading} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import Header from "../Header"
import StudentFeedbackGrid from "./StudentFeedbackGrid"
import CommentSection from "./CommentSection"
import { useParams, useNavigate } from "react-router-dom";


const NilReaction = "nil"

export const StudentView = () => {
  const [selectedReaction, setSelectedReaction] = useState(NilReaction)
  const [visibleComment, setVisibleComment] = useState(false)
  const [visible, setVisible] = useState(false) // for the actual view
  let { code } = useParams();
  let navigate = useNavigate()

  // reset the button when lecturer creates a snapshot
  useEffect(() => {

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"code": code}) 
      }

      fetch("/api/is-code-active", requestOptions)
      .then(res => res.json())
      .then(data => {
          if (!data["valid"]) {
            navigate("/")
          }
      })
      .then(() => {
        socket.on("reset buttons", () => {
          setSelectedReaction(NilReaction)
          setVisibleComment(false)
        })
    
        socket.emit("join", {"room":code, "type":"student"})
      })
      
    // Disconnect when unmounts
    return () => {
      socket.off("reset buttons")
      console.log("hello")
      socket.emit("leave", {"room":code})
    }
    //
  }, [])

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={socket}>      
        <Stack width="100%">
          <Header/>
          <Heading textAlign='center'>Live Reactions</Heading>

          <StudentFeedbackGrid
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
            room={code}
          />
          <CommentSection 
            visible={visibleComment}
            setVisible={setVisibleComment} 
            selectedReaction={selectedReaction}
            room={code}
          />
        </Stack>
      </SocketContext.Provider>
    </ChakraProvider>
  )
}
