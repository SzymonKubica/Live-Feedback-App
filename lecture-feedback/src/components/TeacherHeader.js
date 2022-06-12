import { Flex, Spacer, Button } from "@chakra-ui/react"
import React from "react"
import { ColorModeSwitcher } from "../ColorModeSwitcher"
import HomeButton from "./HomeButton"
import { useLocation } from "react-router-dom"
import { socket, SocketContext } from "../context/socket"
import NavBtn from "./NavButton"

const TeacherHeader = () => {
  const location = useLocation()

  return (
    <Flex width="100%">
      {location.pathname !== "/" && <HomeButton />}
      <Spacer />
      {/* <PercentageSwitcher /> */}
      <SocketContext.Provider value={socket}>
        <Button
          onClick={() => {
            socket.emit("create snapshot")
          }}
        >
          Reset
        </Button>
        <NavBtn name="Snapshots" dst="snapshots" />
      </SocketContext.Provider>
      <ColorModeSwitcher />
    </Flex>
  )
}

export default TeacherHeader
