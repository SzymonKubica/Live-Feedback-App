import React from "react"
import { Link } from "react-router-dom"

import { Button } from "@chakra-ui/react"

const NavBtn = ({ name, dst, onClick, size }) => {
  return (
    <Link to={dst}>
      <Button onClick={onClick} colorScheme="blue" size={size}>
        {name}
      </Button>
    </Link>
  )
}

export default NavBtn
