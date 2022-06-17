import React, { useState, useEffect } from "react"

import {
  Box,
  ChakraProvider,
  Heading,
  Stack,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Container,
  Center,
} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import { useViewport } from "../../hooks/useViewport"
import TeacherHeader from "./TeacherHeader"
import CommentLog from "./CommentLog"
import TeacherGraph2 from "./TeacherGraph2"
import TeacherGraph3 from "./TeacherGraph3"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import TeacherFeedbackBars from "./TeacherFeedbackBars"
import { getColour, Reaction } from "../Reactions"

export const TeacherView = ({isAuth, setAuth}) => {
  const [studentCounter, setStudentCounter] = useState(0)
  const [chartView, setChartView] = useState(0)
  const [visible, setVisible] = useState(false)
  const { width, height } = useViewport()

  let { code } = useParams()
  let navigate = useNavigate();


  const [data, setData] = useState({})
  const [circleGraphData, setCircleGraphData] = useState({
    labels: ["Good", "Confused", "Too Fast", "Chilling"],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          getColour(Reaction.GOOD),
          getColour(Reaction.CONFUSED),
          getColour(Reaction.TOO_FAST),
          getColour(Reaction.CHILLING),
        ],
        borderColor: [
          'rgb(255,255,255)',
          'rgb(255,255,255)',
          'rgb(255,255,255)',
          'rgb(255,255,255)',
        ],
        borderWidth: 1,
      },
    ],
  })

  useEffect(() => {
    // check if teacher is the owner
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({room: code})
    }

    fetch("/api/owner", requestOptions)
    .then(res => res.json())
    .then(data => {
        if (data["owner"]) {
          setVisible(true)
        } else {
          // maybe navigate back to teacher view?
          navigate("/")
        }
    })

    // established teacher can view so continue as normal

    socket.emit("join", { room: code, type: "teacher" })

    socket.on("update", data => {
      setData(data)
      setCircleGraphData(prevState => ({
        labels: prevState.labels,
        datasets: [
          {
            ...prevState.datasets[0],
            data: [data.good, data.confused, data.tooFast, data.chilling],
          },
        ],
      }))
    })

    socket.on("update students connected", data => {
      setStudentCounter(data.count)
      console.log("updating connected students")
    })

    requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ room: code }),
    }

    fetch("/api/student-count", requestOptions)
      .then(res => res.json())
      .then(data => {
        setStudentCounter(data.count)
      })

    fetch("/api/all_reactions", requestOptions)
      .then(res => res.json())
      .then(data => {
        setData(data)
        setCircleGraphData(prevState => ({
          labels: prevState.labels,
          datasets: [
            {
              ...prevState.datasets[0],
              data: [data.good, data.confused, data.tooFast, data.chilling],
            },
          ],
        }))
      })
      .then(console.log("Fetched from api"))

    // Disconnect when unmounts
    return () => {
      socket.off("update students connected")
      socket.emit("leave", { room: code })
    }
  }, [])

  return (
    <ChakraProvider>
      <Box>
        { visible ?
        <SocketContext.Provider value={socket}>
          <TeacherHeader isAuth={isAuth} setAuth={setAuth} state={chartView} setState={setChartView} />
          <Heading textAlign="center">Reaction Analysis</Heading>
          <Heading textAlign="center"> Code: {code} </Heading>
          <Grid templateColumns="repeat(3, 1fr)" height="calc(76vh)">
            <GridItem rowSpan={2} colSpan={2}>
              <Container maxW="100%" id="graphsDiv">
                {chartView == 0 ? (
                  <Container maxW={Math.min(0.66 * width, 0.76 * height)}>
                    <TeacherGraph2 room={code} data={circleGraphData} />
                  </Container>
                ) : chartView == 1 ? (
                  <TeacherFeedbackBars
                    studentCounter={studentCounter}
                    data={data}
                    room={code}
                  />
                ) : (
                  <Container maxW={width * 0.66} maxH={height * 0.76}>
                    <TeacherGraph3 room={code} />
                  </Container>
                )}
              </Container>
            </GridItem>
            <GridItem rowSpan={2}>
              {/* TODO: add get code button */}
              <CommentLog room={code} />
            </GridItem>
          </Grid>

            <Flex>
              <Spacer />
              <Heading>{studentCounter} students</Heading>
            </Flex>
          </SocketContext.Provider>
          : null}
      </Box>
    </ChakraProvider>
  )
}
