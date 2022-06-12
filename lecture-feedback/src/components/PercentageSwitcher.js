import React from "react"
import useLocation from "react-router-dom"

import Switch from "@chakra-ui/react"

const PercentageSwitcher = () => {
  const location = useLocation()

  return (
    <div>
      {" "}
      Show percentages
      <Switch id="show percentages" />
    </div>
  )
}

export default PercentageSwitcher
