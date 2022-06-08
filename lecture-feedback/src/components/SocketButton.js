import React, {useState, useEffect} from "react";
import { Button } from '@chakra-ui/react'
import { socket } from "../context/socket";

export const SocketButton = () => {

    function handleButton() {
        socket.emit("confused")
    }

    return (
    <div>
        <Button colorScheme='blue' onClick={handleButton}>Confused</Button>
    </div>
    );
}