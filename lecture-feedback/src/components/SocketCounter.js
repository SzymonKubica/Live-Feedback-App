import React, {useState, useEffect} from "react";
import socketIOClient from "socket.io-client";
import { socket } from "../context/socket";


export const SocketCounter = () => {
    const [confused, setConfused] = useState(0);

    useEffect(() => {
        socket.on("fromApi", data => {
            setConfused(data.count);
        });

        // Disconnect when unmounts
        return () => socket.off("fromApi");
        //

    }, [])

    return (
    <div>
        <p>{confused}</p>
    </div>
    );
}