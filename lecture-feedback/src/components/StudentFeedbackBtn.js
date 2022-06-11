import { Button } from '@chakra-ui/react'
import React from 'react'
import { socket } from '../context/socket'
import { Reaction, getString } from "./Reactions"

const defaultColor = 500
const selectedColor = 900
const NilButton = 'nil'


function getColourGradient(button, selected) {
    if (button === selected) {
        return selectedColor
    }

    return defaultColor
}

//
function getReaction(color) {
    switch(color) {
        case "green": 
            return Reaction.GOOD
        case "orange":
            return Reaction.TOO_FAST
        case "red":
            return Reaction.CONFUSED
        case "twitter":
            return Reaction.CHILLING 
    }
}

const StudentFeedbackBtn = ({ title, color, selected, setSelected, reaction }) => {
    
    function handleButton() {
        if (color === selected) {
            setSelected(NilButton)
            socket.emit("remove reaction", getString(reaction))
            console.log(getString(reaction))
            
        } else if (selected === NilButton) {
            socket.emit("add reaction", getString(reaction))
            console.log(getString(reaction))
            setSelected(color)
        } else {
            // switched reactions
            socket.emit("remove reaction", getString(getReaction(selected)))
            console.log(getString(getReaction(selected)))
            socket.emit("add reaction", getString(reaction))
            setSelected(color)
        }
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