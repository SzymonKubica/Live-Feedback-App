import React, {useState, useEffect} from "react";
import { Button } from '@chakra-ui/react'
import { socket } from "../context/socket";

export const ToggleButton = () => {
    const [isConfused, setState] = useState(false);



    function handleButton() {
        setState(s => !s);
        if (isConfused) {
            socket.emit("confused");
        } else {
            socket.emit("no longer confused")
        }
    }

    return (
    <div>
        <Button colorScheme='blue' onClick={handleButton}>{isConfused? "All Clear" : "I'm confused"}</Button>
    </div>
    );
}