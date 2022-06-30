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
  setAlertVisible,
  disconnected
}) => {
  return (
    <Center width="100%" height="calc(50vh)">
      <SimpleGrid marginBlock="5%" width="90%" height="90%" columns="2">
        <StudentFeedbackButton
          title="Good"
          color="green"
          reaction={Reaction.GOOD}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          setAlertVisible={setAlertVisible}
          room={room}
          disconnected={disconnected}
        />
        <StudentFeedbackButton
          title="Confused"
          color="red"
          reaction={Reaction.CONFUSED}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          setAlertVisible={setAlertVisible}
          room={room}
          disconnected={disconnected}
        />
        <StudentFeedbackButton
          title="Too Fast"
          color="orange"
          reaction={Reaction.TOO_FAST}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          setAlertVisible={setAlertVisible}
          room={room}
          disconnected={disconnected}
        />
        <StudentFeedbackButton
          title={customReaction}
          color="twitter"
          reaction={Reaction.CUSTOM}
          selectedReaction={selectedReaction}
          setSelectedReaction={setSelectedReaction}
          setAlertVisible={setAlertVisible}
          room={room}
          disconnected={disconnected}
        />
      </SimpleGrid>
    </Center>
  )
}

export default StudentFeedbackGrid
