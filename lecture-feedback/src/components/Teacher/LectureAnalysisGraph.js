import React, { useEffect, useState, useRef } from "react"
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

const LectureAnalysisGraph = ({ room, setTime, customReaction }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

  ChartJS.defaults.font.size=15


  const initialDatasets = {
    good: [],
    confused: [],
    tooFast: [],
    custom: [],
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
          label: customReaction ,
          data: props.custom,
          backgroundColor: getColour(Reaction.CUSTOM),
          borderColor: getColour(Reaction.CUSTOM),
        },
      ],
    }
  }

  // We need to update the data when we actually get reaction from async call
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: room }),
    }

    fetch("/api/analytics_graph_data", requestOptions)
      .then(res => res.json())
      .then(data => {
        setData(getSettings(data))
      })
  }, [customReaction])

  function pad(s) {
    return s < 10 ? '0' + s : s
  }

  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          callback: function sToTime(value, index, ticks) {
            var secs = value % 60;
            value = (value - secs) / 60;
            var mins = value % 60;
            var hrs = (value - mins) / 60;

            return (hrs > 0 ? (pad(hrs) + ':'): '') + pad(mins) + ':' + pad(secs);
          }
        },
      },
      y: {
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "Reactions",
        },
      },
    },
    elements: {
      point: {
        pointRadius: 2,
      },
    },
    onClick: function (event, elementsAtEvent) {
      let valueX = null
      var scale = this.scales["x"]
      valueX = scale.getValueForPixel(event.x)
      setTime(valueX)
    },
  })

  return (
    <Stack marginTop={5}>
      <Line
        id="chart"
        updateMode="none"
        data={data}
        options={options}
        height={50}
      />
    </Stack>
  )
}

export default LectureAnalysisGraph
