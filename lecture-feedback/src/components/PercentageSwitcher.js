import Switch from "@chakra-ui/react"
import React from "react"
import useLocation from "react-router-dom"

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
