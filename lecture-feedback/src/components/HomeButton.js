import React from "react"
import { Link, useLocation } from "react-router-dom"

import { Button } from "@chakra-ui/react"

const HomeButton = () => {
  const location = useLocation()
  function handleButton() {
  }

  return (
    <Link to="/">
      <Button
        onClick={handleButton}
        colorScheme="blue"
        alignSelf="start"
        marginStart="5px"
        marginTop="15px"
      >
        Home
      </Button>
    </Link>
  )
}

export default HomeButton
