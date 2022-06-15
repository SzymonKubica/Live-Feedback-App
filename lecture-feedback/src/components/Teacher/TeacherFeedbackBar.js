import React, { useState, useEffect } from "react"

import { Heading, Progress, Stack } from "@chakra-ui/react"

import { SocketContext } from "../../context/socket"

const TeacherFeedbackBar = ({ studentCount, title, color, reaction, room}) => {
  const [counter, setCounter] = useState(0)

  const socket = React.useContext(SocketContext)

  useEffect(() => {
    socket.on("update " + reaction, data => {
      setCounter(data.count)
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reaction: reaction , room: room}),
    }

    fetch("/api/reaction-count", requestOptions)
      .then(res => res.json())
      .then(data => {
        setCounter(data.count)
      })

    // Disconnect when unmounts
    return () => socket.off("update " + reaction)
  }, [])

  return (
    <Stack>
      <Heading>
        {title}: {counter}
      </Heading>
      {studentCount == 0 ? (
        <Progress colorScheme={color} size="md" value={100} />
      ) : (
        <Progress
          colorScheme={color}
          size="md"
          value={(counter / studentCount) * 100}
        />
      )}
    </Stack>
  )
}

export default TeacherFeedbackBar
