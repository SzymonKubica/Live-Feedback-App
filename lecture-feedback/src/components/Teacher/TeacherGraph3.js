import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { SocketContext } from "../../context/socket";
import { Button, Stack } from "@chakra-ui/react";


const TeacherGraph3 = (props) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );

    const [data, setData] = useState({
        labels: ["then", "now", "at some point"],
        datasets: [
            {
                label: "Good",
                data: [0, 1, 0],
                backgroundColor: 'rgba(0, 255, 0, 0.5)',
                borderColor: "rgb(0, 255, 0)",
            },
            {
                label: "Confused",
                data: [1, 2, 0],
                backgroundColor: 'rgba(255, 0, 0, 0.5)',
                borderColor: "rgb(255, 0, 0)",
            },
            {
                label: "Too Fast",
                data: [0, 5, 0],
                backgroundColor: 'rgba(255, 255, 0, 0.5)',
                borderColor: "rgb(255, 255, 0)",
            },
            {
                label: "Chilling",
                data: [2, 5, 10],
                backgroundColor: 'rgba(0, 0, 255, 0.5)',
                borderColor: "rgb(0, 0, 255)",
            },
        ],
    })

    const [options, setOptions] = useState({
        responsive: true,
    })

    const socket = React.useContext(SocketContext)

    // useEffect(() => {
    //     socket.on("update all", data => {
    //         setData(prevState => ({
    //             labels: prevState.labels,
    //             datasets: [
    //                 {
    //                     ...prevState.datasets[0],
    //                     data: [data.good, data.confused, data.tooFast, data.chilling],
    //                 },
    //             ],
    //         }))
    //     })

    //     const requestOptions = {
    //         method: "POST",
    //         headers: { "Content-Type": "application/json" },
    //     }

    //     fetch("/api/all_reactions", requestOptions)
    //         .then(res => res.json())
    //         .then(data => {
    //             setData(prevState => ({
    //                 labels: prevState.labels,
    //                 datasets: [
    //                     {
    //                         ...prevState.datasets[0],
    //                         data: [data.good, data.confused, data.tooFast, data.chilling],
    //                     },
    //                 ],
    //             }))
    //         })
    //         .then(console.log("Fetched from api"))

    //     // Disconnect when unmounts
    //     return () => socket.off("update all")
    // }, [])

    return (
        <Stack>
            <Line updateMode="none" data={data} options={options} onClick={() => setData(prevData => ({
                labels: ["now", "at some point", "later"],
                datasets:
                    [
                        {
                            ...prevData.datasets[0],
                            data: [1, 0, 3],
                        },
                        {
                            ...prevData.datasets[1],
                            data: [2, 0, 1],
                        },
                        {
                            ...prevData.datasets[2],
                            data: [5, 0, 1],
                        },
                        {
                            ...prevData.datasets[3],
                            data: [5, 10, 15],
                        },
                    ]
            }))} />
        </Stack>
    )
}

export default TeacherGraph3
