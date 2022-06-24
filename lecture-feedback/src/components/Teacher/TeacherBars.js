import { Box, propNames, Stack } from "@chakra-ui/react"
import React from "react"
import TeacherFeedbackBar from "./TeacherFeedbackBar"
import { getString, Reaction } from "../Reactions"

const TeacherBars = ({ studentCounter, code, customReaction }) => {
  return (
    <Stack marginStart={10} marginTop={10} width="90%" spacing="10%">
      <Box width="100%">
        <Stack spacing={20}>
          <TeacherFeedbackBar
            studentCount={studentCounter}
            title="Good"
            color="green"
            reaction={getString(Reaction.GOOD)}
            room={code}
          />
          <TeacherFeedbackBar
            studentCount={studentCounter}
            title="Confused"
            color="red"
            reaction={getString(Reaction.CONFUSED)}
            room={code}
          />
          <TeacherFeedbackBar
            studentCount={studentCounter}
            title="Too Fast"
            color="orange"
            reaction={getString(Reaction.TOO_FAST)}
            room={code}
          />
          <TeacherFeedbackBar
            studentCount={studentCounter}
            title={customReaction}
            color="twitter"
            reaction={getString(Reaction.CHILLING)}
            room={code}
          />
        </Stack>
      </Box>
    </Stack>
  )
}

export default TeacherBars
