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

const TeacherGraph3 = ({ room }) => {
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

  function getLabels() {
    let labels = []
    let i
    for (i = 0; i < 21; i++) {
      labels.push(String(i * -0.5))
    }
    labels.reverse()
    return labels
  }

  function getSettings(props) {
    return {
      labels: getLabels(),
      datasets: [
        {
          label: "Good",
          data: props.good,
          backgroundColor: "rgba(0, 255, 0, 0.5)",
          borderColor: "rgb(0, 255, 0)",
          // hidden: true,
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

  const REFRESH_TIME = 10000

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: room }),
    }

    function fetch_graph_data() {
      fetch("/api/line_graph_data", requestOptions)
        .then(res => res.json())
        .then(data => {
          setData(getSettings(data))
        })
        .then(console.log("Fetched from api"))
    }

    fetch_graph_data()

    const interval = setInterval(() => {
      fetch_graph_data()
    }, REFRESH_TIME)
  }, [])

  const [options, setOptions] = useState({
    responsive: true,
  })

  return (
    <Stack>
      <Line updateMode="none" data={data} options={options} />
    </Stack>
  )
}

export default TeacherGraph3
