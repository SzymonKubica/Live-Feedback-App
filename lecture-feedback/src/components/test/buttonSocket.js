import React, {useState, useEffect} from "react";
import { Button, ButtonGroup } from '@chakra-ui/react'
import socketIOClient from "socket.io-client";
import { socket } from "../../context/socket";

export const ButtonSocketComponent = () => {

    const [confused, setConfused] = useState(0);

    useEffect(() => {
        socket.on("fromApi", data => {
            setConfused(data.count);
        });

        // Disconnect when unmounts
        return () => socket.off("fromApi");
        //

    }, [])

    function handleButton() {
        socket.emit("confused")
    }



    return (
    <div>
        <Button colorScheme='blue' onClick={handleButton}>Button</Button>
        <p>{confused}</p>
    </div>
    );
}