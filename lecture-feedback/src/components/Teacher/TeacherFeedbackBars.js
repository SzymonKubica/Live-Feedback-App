import React, { useState, useEffect } from "react"

import { Box, Stack } from "@chakra-ui/react"

import { SocketContext } from "../../context/socket"
import TeacherFeedbackBar from "./TeacherFeedbackBar"

const TeacherFeedbackBars = props => {
  return (
    <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
      <Box width="100%">
        <Stack spacing={20}>
          <TeacherFeedbackBar
            counter={props.data.good}
            studentCount={props.studentCounter}
            title="Good"
            color="green"
          />
          <TeacherFeedbackBar
            counter={props.data.confused}
            studentCount={props.studentCounter}
            title="Confused"
            color="red"
          />
          <TeacherFeedbackBar
            counter={props.data.tooFast}
            studentCount={props.studentCounter}
            title="Too Fast"
            color="orange"
          />
          <TeacherFeedbackBar
            counter={props.data.custom}
            studentCount={props.studentCounter}
            title={props.customReaction}
            color="twitter"
          />
        </Stack>
      </Box>
    </Stack>
  )
}

export default TeacherFeedbackBars
