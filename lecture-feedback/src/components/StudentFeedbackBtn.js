import { Button } from '@chakra-ui/react'
import React from 'react'

const defaultColor = 500
const selectedColor = 900
const NilButton = 'nil'


function getColourGradient(button, selected) {
    if (button === selected) {
        return selectedColor
    }

    return defaultColor
}

const StudentFeedbackBtn = ({ title, color, selected, setSelected }) => {
    return (
        <Button
            colorScheme={color}
            bg={`${color}.${getColourGradient(color, selected)}`}
            onClick={() => color === selected ? setSelected(NilButton) : setSelected(color)}
            height='100%' >
            {title}
        </Button>
    )
}

export default StudentFeedbackBtn