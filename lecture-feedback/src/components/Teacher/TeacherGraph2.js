import React, { useEffect, useState } from "react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { SocketContext } from "../../context/socket"

const TeacherGraph2 = ({ data }) => {
  ChartJS.register(ArcElement, Tooltip, Legend)

  ChartJS.defaults.font.size=20


  const [options, setOptions] = useState({
    responsive: true,
  })

  return <Doughnut data={data} options={options} />
}

export default TeacherGraph2
