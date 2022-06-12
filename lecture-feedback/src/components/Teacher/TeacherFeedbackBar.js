import React, { useState, useEffect } from "react"

import { Heading, Progress, Stack } from "@chakra-ui/react"

import { SocketContext } from '../../context/socket'

const TeacherFeedbackBar = ({ studentCount, title, color, reaction }) => {
  const [counter, setCounter] = useState(0)

  const socket = React.useContext(SocketContext);  

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
