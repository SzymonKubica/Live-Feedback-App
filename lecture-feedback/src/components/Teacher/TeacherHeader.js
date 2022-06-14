import React from "react"
import { useLocation } from "react-router-dom"

import { Flex, Spacer, Button } from "@chakra-ui/react"
import { ColorModeSwitcher } from "../../ColorModeSwitcher"

import { SocketContext } from "../../context/socket"
import HomeButton from "../HomeButton"
import NavButton from "../NavButton"
import LayoutSwitcher from "./LayoutSwitcher"

const TeacherHeader = props => {
  const location = useLocation()

  const socket = React.useContext(SocketContext)

  return (
    <Flex width="100%">
      {location.pathname !== "/" && <HomeButton />}
      <Spacer />
      <LayoutSwitcher state={props.state} setState={props.setState} />
      <Button
        marginStart="5px"
        marginTop="15px"
        onClick={() => {
          socket.emit("create snapshot")
        }}
      >
        Reset
      </Button>
      <NavButton name="Snapshots" dst="snapshots" />
      <ColorModeSwitcher marginStart="5px" marginTop="15px" />
    </Flex>
  )
}

export default TeacherHeader
