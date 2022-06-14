import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js"
import { SocketContext } from "../../context/socket"
import { Button, Stack } from "@chakra-ui/react"

const TeacherGraph3 = props => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  const initialDatasets = {
    good: [],
    confused: [],
    tooFast: [],
    chilling: [],
  }

  const [data, setData] = useState(getSettings(initialDatasets))

  const [options, setOptions] = useState({
    responsive: true,
  })

  const socket = React.useContext(SocketContext)

  function getSettings(props) {
    return {
      labels: [
        "-5",
        "-4.5",
        "-4",
        "-3.5",
        "-3",
        "-2.5",
        "-2",
        "-1.5",
        "-1",
        "-0.5",
        "0",
      ],
      datasets: [
        {
          label: "Good",
          data: props.good,
          backgroundColor: "rgba(0, 255, 0, 0.5)",
          borderColor: "rgb(0, 255, 0)",
        },
        {
          label: "Confused",
          data: props.confused,
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          borderColor: "rgb(255, 0, 0)",
        },
        {
          label: "Too Fast",
          data: props.tooFast,
          backgroundColor: "rgba(255, 255, 0, 0.5)",
          borderColor: "rgb(255, 255, 0)",
        },
        {
          label: "Chilling",
          data: props.chilling,
          backgroundColor: "rgba(0, 0, 255, 0.5)",
          borderColor: "rgb(0, 0, 255)",
        },
      ],
    }
  }

  const REFRESH_TIME = 3000

  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("update line graph")
    }, REFRESH_TIME)

    socket.on("update line graph", data => {
      setData(getSettings(data))
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }

    fetch("/api/line_graph_data", requestOptions)
      .then(res => res.json())
      .then(data => {
        setData(getSettings(data))
        console.log(getSettings(data))
      })
      .then(console.log("Fetched from api"))

    // Disconnect when unmounts
    return () => socket.off("update all")
  }, [])

  return (
    <Stack>
      <Line updateMode="none" data={data} options={options} />
    </Stack>
  )
}

export default TeacherGraph3
