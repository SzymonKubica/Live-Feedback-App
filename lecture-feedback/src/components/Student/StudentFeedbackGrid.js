import React from "react"

import { Center, SimpleGrid } from "@chakra-ui/react"

import StudentFeedbackButton from "./StudentFeedbackButton"
import { Reaction } from "./Reactions"

const StudentFeedbackGrid = ({ selectedReaction, setSelectedReaction }) => {
  return (
    <Center width="100%" height="calc(85vh)">
      <SimpleGrid marginBlock="5%" width="90%" height="90%" columns="2">
        <StudentFeedbackButton
          title="Good"
          color="green"
          reaction={Reaction.GOOD}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
        <StudentFeedbackButton
          title="Confused"
          color="red"
          reaction={Reaction.CONFUSED}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
        <StudentFeedbackButton
          title="Too Fast"
          color="orange"
          reaction={Reaction.TOO_FAST}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
        <StudentFeedbackButton
          title="Chilling"
          color="twitter"
          reaction={Reaction.CHILLING}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
        />
      </SimpleGrid>
    </Center>
  )
}

export default StudentFeedbackGrid
