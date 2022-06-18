import React, { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js"
import { Stack } from "@chakra-ui/react"
import Reaction, { getColour } from "../Reactions"

const LectureAnalysisGraph = ({ room }) => {
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

  function getSettings(props) {
    return {
      datasets: [
        {
          label: "Good",
          data: props.good,
          backgroundColor: getColour(Reaction.GOOD),
          borderColor: getColour(Reaction.GOOD),
        },
        {
          label: "Confused",
          data: props.confused,
          backgroundColor: getColour(Reaction.CONFUSED),
          borderColor: getColour(Reaction.CONFUSED),
        },
        {
          label: "Too Fast",
          data: props.tooFast,
          backgroundColor: getColour(Reaction.TOO_FAST),
          borderColor: getColour(Reaction.TOO_FAST),
        },
        {
          label: "Chilling",
          data: props.chilling,
          backgroundColor: getColour(Reaction.CHILLING),
          borderColor: getColour(Reaction.CHILLING),
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
      fetch("/api/analytics_graph_data", requestOptions)
        .then(res => res.json())
        .then(data => {
          setData(getSettings(data))
          console.log(data)
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
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  })

  return (
    <Stack>
      <Line updateMode="none" data={data} options={options} />
    </Stack>
  )
}

export default LectureAnalysisGraph
