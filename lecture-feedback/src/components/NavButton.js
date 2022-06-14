import React from "react"
import { Link } from "react-router-dom"

import { Button } from "@chakra-ui/react"

const NavButton = ({ name, dst, onClick, size }) => {
  return (
    <Link to={dst}>
      <Button
        onClick={onClick}
        colorScheme="blue"
        size={size}
        marginStart="5px"
        marginTop="15px"
      >
        {name}
      </Button>
    </Link>
  )
}

export default NavButton
