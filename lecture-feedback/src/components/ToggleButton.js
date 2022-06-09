import React, {useState, useEffect} from "react";
import { Button } from '@chakra-ui/react'
import { socket } from "../context/socket";

export const ToggleButton = (props) => {
    const [isToggled, setState] = useState(false);



    function handleButton() {
        setState(s => !s);
        if (!isToggled) {
            socket.emit(props.reaction);
        } else {
            socket.emit("no longer " + props.reaction)
        }
    }

    return (
    <div>
        {props.reaction !== "good" ? 
        <Button colorScheme='blue' onClick={handleButton} style={{textTransform: "capitalize"}}>{isToggled? "" : "Not "} {props.reaction}</Button>
        :
        <Button colorScheme='blue' onClick={handleButton}>{isToggled? "Very Good" : "Normal Good"}</Button>
        }
    </div>
    );
}