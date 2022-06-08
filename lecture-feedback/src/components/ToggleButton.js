import React, {useState, useEffect} from "react";
import { Button } from '@chakra-ui/react'
import { socket } from "../context/socket";

export const ToggleButton = (props) => {
    const [isToggled, setState] = useState(true);



    function handleButton() {
        setState(s => !s);
        if (isToggled) {
            socket.emit(props.reaction);
        } else {
            socket.emit("no longer " + props.reaction)
        }
    }

    return (
    <div>
        <Button colorScheme='blue' onClick={handleButton}>{isToggled? "" : "Not "} {props.reaction}</Button>
    </div>
    );
}