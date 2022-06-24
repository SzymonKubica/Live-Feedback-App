import React from "react"

import { Center, SimpleGrid } from "@chakra-ui/react"

import StudentFeedbackButton from "./StudentFeedbackButton"
import { Reaction } from "../Reactions"
import CommentSection from "./CommentSection"

const StudentFeedbackGrid = ({
  selectedReaction,
  setSelectedReaction,
  room,
  customReaction,
}) => {
  return (
    <Center width="100%" height="calc(70vh)">
      <SimpleGrid marginBlock="5%" width="90%" height="90%" columns="2">
        <StudentFeedbackButton
          title="Good"
          color="green"
          reaction={Reaction.GOOD}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          room={room}
        />
        <StudentFeedbackButton
          title="Confused"
          color="red"
          reaction={Reaction.CONFUSED}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          room={room}
        />
        <StudentFeedbackButton
          title="Too Fast"
          color="orange"
          reaction={Reaction.TOO_FAST}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          room={room}
        />
        <StudentFeedbackButton
          title={customReaction}
          color="twitter"
          reaction={Reaction.CUSTOM}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          room={room}
        />
      </SimpleGrid>
    </Center>
  )
}

export default StudentFeedbackGrid
