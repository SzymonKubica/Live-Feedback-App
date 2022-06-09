import { Box, ChakraProvider, Heading, Progress, Stack, Button } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'
import Header from './Header'
import TeacherFeedbackBar from './TeacherFeedbackBar'

const Teacher = () => {
    return (
        <ChakraProvider>
            <Header />
            <Stack marginStart={10} marginTop={10} width='90%' spacing='10%'>
                <Box width='60%' >
                    <Stack spacing={20}>
                        <TeacherFeedbackBar title='Good' color='green' />
                        <TeacherFeedbackBar title='Confused' color='red' />
                        <TeacherFeedbackBar title='Too Fast' color='orange' />
                        <TeacherFeedbackBar title='Chilling' color='twitter' />
                    </Stack>
                </Box>
                <Heading alignSelf='end'>42 students</Heading>
            </Stack>
        </ChakraProvider>
    )
}

export default Teacher