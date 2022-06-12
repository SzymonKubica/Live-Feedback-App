import { Heading, Progress, Stack } from "@chakra-ui/react"
import React, { useState, useEffect } from "react"
import socket from "../context/socket"

const TeacherFeedbackBar = ({ studentCount, title, color, reaction }) => {
  const [counter, setCounter] = useState(0)

  useEffect(() => {
    socket.on("update " + reaction, data => {
      setCounter(data.count)
    })

    // Disconnect when unmounts
    return () => socket.off("update " + reaction)
  }, [])

  return (
    <Stack>
      <Heading>{title}</Heading>
      <Progress colorScheme={color} size="md" value={counter} />
    </Stack>
  )
}

export default TeacherFeedbackBar
