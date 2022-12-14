import React from "react"
import { useLocation } from "react-router-dom"

import { Flex, Spacer, Button} from "@chakra-ui/react"
import { ColorModeSwitcher } from "../ColorModeSwitcher"

import HomeButton from "./HomeButton"
import { LogoutButton } from "./LogoutButton"

const Header = ({isAuth, setAuth}) => {
  const location = useLocation()
  return (
    <Flex width="100%">
      {location.pathname !== "/" && <HomeButton />}
      <Spacer />
      <LogoutButton isAuth={isAuth} setAuth={setAuth}/>
      <ColorModeSwitcher />
    </Flex>
  )
}

export default Header
