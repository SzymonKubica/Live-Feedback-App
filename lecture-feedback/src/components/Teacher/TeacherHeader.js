import React from "react"
import { useLocation } from "react-router-dom"

import { Flex, Spacer, Button } from "@chakra-ui/react"
import { ColorModeSwitcher } from "../../ColorModeSwitcher"

import { SocketContext } from "../../context/socket"
import HomeButton from "../HomeButton"
import NavBtn from "../NavButton"

const TeacherHeader = () => {
  const location = useLocation()

  const socket = React.useContext(SocketContext);  

  return (
    <Flex width="100%">
      {location.pathname !== "/" && <HomeButton />}
      <Spacer />
      {/* <PercentageSwitcher /> */}
        <Button
          onClick={() => {
            socket.emit("create snapshot")
          }}
        >
          Reset
        </Button>
        <NavBtn name="Snapshots" dst="snapshots" />
      <ColorModeSwitcher />
    </Flex>
  )
}

export default TeacherHeader
