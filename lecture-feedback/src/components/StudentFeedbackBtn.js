import { Button } from '@chakra-ui/react'
import React from 'react'
import { socket } from '../context/socket'

const defaultColor = 500
const selectedColor = 900
const NilButton = 'nil'


function getColourGradient(button, selected) {
    if (button === selected) {
        return selectedColor
    }

    return defaultColor
}

const StudentFeedbackBtn = ({ title, color, selected, setSelected, reaction }) => {
    
    function handleButton() {
        if (color === selected) {
            setSelected(NilButton)
            socket.emit("no longer " + reaction)
            
        } else if (selected === NilButton) {
            socket.emit(reaction)
            setSelected(color)
        } else {
            // switched reactions
            socket.emit("no longer" + selected)
            socket.emit(reaction)

            setSelected(color)
        }
        
        // setState(s => !s);
        // if (!isToggled) {
        //     socket.emit(props.reaction);
        // } else {
        //     socket.emit("no longer " + props.reaction)
        // }
    }
    
    return (
        <Button
            colorScheme={color}
            bg={`${color}.${getColourGradient(color, selected)}`}
            onClick={handleButton}
            height='100%' >
            {title}
        </Button>
    )
}

export default StudentFeedbackBtn