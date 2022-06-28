import React, { useState, useEffect, useRef} from "react"

import { ChakraProvider, Stack, theme, Heading, Box } from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import Header from "../Header"
import StudentFeedbackGrid from "./StudentFeedbackGrid"
import CommentSection from "./CommentSection"
import { useParams, useNavigate } from "react-router-dom"
import CustomAlert from "../CustomAlert"
import { getString, NilReaction } from "../Reactions"


export const StudentView = () => {
  const [selectedReaction, setSelectedReaction] = useState(NilReaction)
  const [resubmitReaction, setResubmitReaction] = useState(false)
  const [visibleComment, setVisibleComment] = useState(false)
  const [customReaction, setCustomReaction] = useState("Too Slow")
  const [alertVisible, setAlertVisible] = useState(false)
  const [disconnected, setDisconnected] = useState(false)
  let { code } = useParams()
  let navigate = useNavigate()

  // keep reference up to date to use in below useEffect on reconnection
  useEffect(() => {
    if (selectedReaction !== NilReaction && resubmitReaction) {
      socket.emit("add reaction", getString(selectedReaction), code)
      setResubmitReaction(false)
    }
  }, [selectedReaction, resubmitReaction])
  
  // reset the button when lecturer creates a snapshot
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: code }),
    }

    fetch("/api/is-code-active", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (!data["valid"]) {
          navigate("/")
        }
      })
      .then(() => {        
        socket.emit("join", { room: code, type: "student" })

      })
      .then(() => {  
        socket.on("reset buttons", () => {
          setSelectedReaction(NilReaction)
          setAlertVisible(true)
          setVisibleComment(false)
        })

        socket.on("presentation ended", () => {
          navigate("/")
        })

        // For when you disconnect due to an error and reconnect
        socket.on("disconnect", () => {
          setDisconnected(true)
        })

        socket.on("connect", () => {
          setDisconnected(false)
          setResubmitReaction(true)
        })

      })
    fetch("/api/get-custom-reaction", requestOptions)
      .then(res => res.json())
      .then(data => {
        setCustomReaction(data.reaction)
      })

    // Disconnect when unmounts
    return () => {
      socket.off("reset buttons")
      socket.off("presentation ended")
      socket.emit("leave", { room: code })
    }
    //
  }, [disconnected])

  function onClose() {
    setAlertVisible(false)
  }

  return (
    <ChakraProvider theme={theme}>
      <SocketContext.Provider value={socket}>
        <Stack width="100%">
          <Header />
          {disconnected ? 
                  <CustomAlert
                    title="Connection lost, trying to reconnect ..."
                    description="Check your connection and refresh."
                    onClose={() => setDisconnected(false)}
                  />
          : null }
          {alertVisible ? (
            <Box height="50">
              <CustomAlert
                title="Reactions were reset!"
                description="Please update your feedback."
                onClose={onClose}
              />
            </Box>
          ) : (
            <Heading textAlign="center" height="50">
              Live Reactions
            </Heading>
          )}

          <StudentFeedbackGrid
            selectedReaction={selectedReaction}
            setSelectedReaction={setSelectedReaction}
            customReaction={customReaction}
            room={code}
            setAlertVisible={setAlertVisible}
            disconnected={disconnected}
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
