import { Heading, Progress, Stack } from '@chakra-ui/react'
import React from 'react'

const TeacherFeedbackBar = ({title, color}) => {
    return (
        <Stack>
            <Heading>{title}</Heading>
            <Progress colorScheme={color} size='md' value={20} />
        </Stack>
    )
}

export default TeacherFeedbackBar