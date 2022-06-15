import React from "react"

import { Button } from "@chakra-ui/react"

const LayoutSwitcher = props => {
  function handleButton() {
    props.setState((props.state + 1) % 3)
  }
  return (
    <Button
      onClick={handleButton}
      colorScheme="blue"
      alignSelf="start"
      marginStart="5px"
      marginTop="15px"
    >
      Switch Layout
    </Button>
  )
}

export default LayoutSwitcher
