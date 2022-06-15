import React, { useState, useEffect } from "react"

import { Heading, Progress, Stack } from "@chakra-ui/react"

import { SocketContext } from "../../context/socket"

const TeacherFeedbackBar = ({ counter, studentCount, title, color }) => {
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
