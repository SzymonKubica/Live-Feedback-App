import { Flex, Spacer } from "@chakra-ui/react"
import React from "react"
import { ColorModeSwitcher } from "../ColorModeSwitcher"
import HomeButton from "./HomeButton"
import { useLocation } from "react-router-dom"

const Header = () => {
  const location = useLocation()

  return (
    <Flex width="100%">
      {location.pathname !== "/" && <HomeButton />}
      <Spacer />
      <ColorModeSwitcher />
    </Flex>
  )
}

export default Header
