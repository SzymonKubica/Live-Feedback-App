import React, { useState, useEffect } from "react"

import {
  Box,
  ChakraProvider,
  theme,
  Heading,
  Grid,
  GridItem,
  Flex,
  Spacer,
  Container,
  Center,
  Button,
} from "@chakra-ui/react"

import { socket, SocketContext } from "../../context/socket"
import { useViewport } from "../../hooks/useViewport"
import TeacherHeader from "./TeacherHeader"
import CommentLog from "./CommentLog"
import TeacherGraph2 from "./TeacherGraph2"
import TeacherGraph3 from "./TeacherGraph3"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import TeacherFeedbackBars from "./TeacherFeedbackBars"
import { getColour, Reaction } from "../Reactions"
import { PresentationFileFinder } from "./Finder"
import CustomAlert from "../CustomAlert"

export const TeacherView = ({ isAuth, setAuth }) => {
  const [studentCounter, setStudentCounter] = useState(0)
  const [chartView, setChartView] = useState(0)
  const [visible, setVisible] = useState(false)
  const { width, height } = useViewport()
  const [showSave, setShowSave] = useState(false)
  const [customReaction, setCustomReaction] = useState("")
  const [disconnectAlertVisible, setDisconnectAlertVisible] = useState(false)

  let { code } = useParams()
  let navigate = useNavigate()

  const [data, setData] = useState({})
  const [circleGraphData, setCircleGraphData] = useState({
    labels: ["Good", "Confused", "Too Fast", customReaction],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          getColour(Reaction.GOOD),
          getColour(Reaction.CONFUSED),
          getColour(Reaction.TOO_FAST),
          getColour(Reaction.CUSTOM),
        ],
        borderColor: [
          "rgb(255,255,255)",
          "rgb(255,255,255)",
          "rgb(255,255,255)",
          "rgb(255,255,255)",
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
      body: JSON.stringify({ room: code }),
    }
    // first check its even active
    fetch("/api/is-code-active", requestOptions)
    .then(res => res.json())
    .then(data => {
        if (!data["valid"]) {
          navigate("/")
        }})
    .then(() => {
      fetch("/api/get-custom-reaction", requestOptions)
      .then(res => res.json())
      .then(data => {
        const custReaction = data.reaction
        setCustomReaction(prev => {
            let requestOptions = {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ "code": code }),
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
              .then(() => {
                socket.emit("join", { room: code, type: "teacher" })

                // For when you disconnect due to an error and reconnect
                socket.on("disconnect", () => {
                  setDisconnectAlertVisible(true)
                })

                socket.on("connect", () => {
                  setDisconnectAlertVisible(false)
                })
        
                socket.on("update", data => {
                  setData(data)
                  setCircleGraphData(prevState => ({
                    labels: ["Good", "Confused", "Too Fast", custReaction],
                    datasets: [
                      {
                        ...prevState.datasets[0],
                        data: [data.good, data.confused, data.tooFast, data.custom],
                      },
                    ],
                  }))
                })
        
                socket.on("update students connected", data => {
                  setStudentCounter(data.count)
                  console.log("updating connected students")
                })
        
                socket.on("presentation ended", () => {
                  // do some other stuff to save the video
        
                  navigate("/teacher/menu")
                  // onOpen()
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
                      labels: ["Good", "Confused", "Too Fast", custReaction],
                      datasets: [
                        {
                          ...prevState.datasets[0],
                          data: [data.good, data.confused, data.tooFast, data.custom],
                        },
                      ],
                    }))
                  })
              })
              return custReaction
          })
        })

    })

    
    

    // Disconnect when unmounts
    return () => {
      socket.off("update")
      socket.off("update students connected")
      socket.off("presentation ended")
      socket.emit("leave", { room: code })
    }
  }, [disconnectAlertVisible])


  const handleEndPresentation = () => {
    socket.off("presentation ended") // we only want to close other lectuers tabs, not the current (if they have open)
    socket.emit("end presentation")
    setShowSave(true)
  }

  return (
    <ChakraProvider theme={theme}>
      <Box height={height}>
        {showSave ? (
          <Center>
            <PresentationFileFinder allowSave={true} code={code} />
          </Center>
        ) : (
          <Box>
            {visible ? (
              <SocketContext.Provider value={socket}>
                <TeacherHeader
                  isAuth={isAuth}
                  setAuth={setAuth}
                  state={chartView}
                  setState={setChartView}
                />
                {disconnectAlertVisible ? 
                  <CustomAlert
                    title="Connection lost, trying to reconnect ..."
                    description="Check your connection and refresh."
                    onClose={() => setDisconnectAlertVisible(false)}
                  />: null }
                <Heading textAlign="center">Reaction Analysis</Heading>
                <Heading textAlign="center"> Code: {code} </Heading>
                <Grid templateColumns="repeat(3, 1fr)" height="calc(70vh)">
                  <GridItem rowSpan={2} colSpan={2}>
                    <Container maxW="100%" id="graphsDiv">
                      {chartView === 0 ? (
                        <Container maxW={Math.min(0.66 * width, 0.70 * height)}>
                          <TeacherGraph2 room={code} data={circleGraphData} />
                        </Container>
                      ) : chartView === 1 ? (
                        <TeacherFeedbackBars
                          studentCounter={studentCounter}
                          data={data}
                          room={code}
                          customReaction={customReaction}
                        />
                      ) : (
                        <Container maxW={width * 0.66} maxH={height * 0.70}>
                          <TeacherGraph3
                            room={code}
                            customReaction={customReaction}
                          />
                        </Container>
                      )}
                    </Container>
                  </GridItem>
                  <GridItem rowSpan={2}>
                    {/* TODO: add get code button */}
                    <CommentLog room={code} />
                  </GridItem>
                </Grid>

                <Flex height='100%' marginTop={height * 0.01}>
                  <Spacer />
                  <Button onClick={handleEndPresentation} size='lg'>
                    End Presentation
                  </Button>
                  <Spacer />
                  <Heading>{studentCounter} students</Heading>
                </Flex>
              </SocketContext.Provider>
            ) : null}
          </Box>
        )}
      </Box>
    </ChakraProvider>
  )
}
