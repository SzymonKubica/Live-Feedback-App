import React, { useEffect, useState } from "react"
import Chart from "react-apexcharts"
import { SocketContext } from "../../context/socket"

const TeacherGraph = props => {
  const socket = React.useContext(SocketContext)
  useEffect(() => {
    socket.on("update all", data => {
      setState(prevState => ({
        series: [data.good, data.confused, data.tooFast, data.chilling],
        options: prevState.options,
      }))
    })

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }

    fetch("/api/all_reactions", requestOptions)
      .then(res => res.json())
      .then(data => {
        setState(prevState => ({
          series: [data.good, data.confused, data.tooFast, data.chilling],
          options: prevState.options,
        }))
      })
      .then(console.log("Fetched from api"))

    // Disconnect when unmounts
    return () => socket.off("update all")
  }, [])

  const [state, setState] = useState({
    colorblind: props.colorblind,
    series: [0, 0, 0, 0],
    options: {
      chart: {
        width: 380,
        type: "pie",
      },
      legend: {
        fontSize: 20,
        labels: {
          colors: [props.textColor],
        },
      },
      colors: props.colors,
      fill: {
        type: "pattern",
        opacity: 1,
        pattern: {
          enabled: true,
          style: props.patterns,
          strokeWidth: props.colorblind ? "1" : "10",
        },
      },
      labels: props.labels.map(
        (label, i) =>
          label + (props.colorblind ? " (" + props.patterns[i] + ")" : "")
      ),
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 700,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  })

  return (
    <div id="chart">
      <Chart
        options={state.options}
        series={state.series}
        type="donut"
        height="70%"
      />
    </div>
  )
}

TeacherGraph.defaultProps = {
  colorblind: false,
  patterns: ["verticalLines", "squares", "horizontalLines", "slantedLines"],
}

export default TeacherGraph
