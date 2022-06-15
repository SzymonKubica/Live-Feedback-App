import React, { useState, useEffect } from "react"

import { Box, Stack } from "@chakra-ui/react"

import { SocketContext } from "../../context/socket"
import TeacherFeedbackBar from "./TeacherFeedbackBar"

const TeacherFeedbackBars = props => {
  const socket = React.useContext(SocketContext)

  const [confused, setConfused] = useState(0)
  const [good, setGood] = useState(0)
  const [tooFast, setTooFast] = useState(0)
  const [chilling, setChilling] = useState(0)
  const [studentCounter, setStudentCounter] = useState(0)

  function setCounters(data) {
    setConfused(data.confused)
    setGood(data.good)
    setChilling(data.chilling)
    setTooFast(data.tooFast)
  }

  useEffect(() => {
    socket.emit("join", { room: props.room, type: "teacher" })
    socket.on("update", data => {
      console.log(data)
      setCounters(data)
    })

    socket.on("update students connected", data => {
      setStudentCounter(data.count)
      console.log(data.count)
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: props.room }),
    }

    fetch("/api/student-count", requestOptions)
      .then(res => res.json())
      .then(data => {
        setStudentCounter(data.count)
      })

    fetch("/api/all_reactions", requestOptions)
      .then(res => res.json())
      .then(data => {
        setCounters(data)
      })

    // Disconnect when unmounts
    return () => {
      socket.off("update students connected")
      socket.emit("leave", { room: props.room })
    }
  }, [])

  return (
    <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
      <Box width="100%">
        <Stack spacing={20}>
          <TeacherFeedbackBar
            counter={good}
            studentCount={studentCounter}
            title="Good"
            color="green"
          />
          <TeacherFeedbackBar
            counter={confused}
            studentCount={studentCounter}
            title="Confused"
            color="red"
          />
          <TeacherFeedbackBar
            counter={tooFast}
            studentCount={studentCounter}
            title="Too Fast"
            color="orange"
          />
          <TeacherFeedbackBar
            counter={chilling}
            studentCount={studentCounter}
            title="Chilling"
            color="twitter"
          />
        </Stack>
      </Box>
    </Stack>
  )
}

export default TeacherFeedbackBars
