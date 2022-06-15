import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { SocketContext } from "../../context/socket";


const TeacherGraph2 = ({room}) => {

    ChartJS.register(ArcElement, Tooltip, Legend);

    const [data, setData] = useState({
        labels: ["Good", "Confused", "Too Fast", "Chilling"],
        datasets: [
            {
                data: [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.5)',
                    'rgba(255, 0, 0, 0.5)',
                    'rgba(255, 255, 0, 0.5)',
                    'rgba(0, 0, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(0, 255, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(255, 255, 0, 1)',
                    'rgba(0, 0, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    })

    const [options, setOptions] = useState({
        responsive: true,
    })

    const socket = React.useContext(SocketContext)

    useEffect(() => {
        socket.on("update all", data => {
            setData(prevState => ({
                labels: prevState.labels,
                datasets: [
                    {
                        ...prevState.datasets[0],
                        data: [data.good, data.confused, data.tooFast, data.chilling],
                    },
                ],
            }))
        })

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"room": room})
        }

        fetch("/api/all_reactions", requestOptions)
            .then(res => res.json())
            .then(data => {
                setData(prevState => ({
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
        return () => socket.off("update all")
    }, [])

    return (
        <Doughnut data={data} options={options} />
    )
}

export default TeacherGraph2
