import { Center, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import StudentFeedbackBtn from './StudentFeedbackBtn'

const StudentFeedbackGrid = ({selected, setSelected}) => {
    return (
        <Center width='100%' height='calc(85vh)'>
            <SimpleGrid
                marginBlock='5%'
                width='90%'
                height='90%'
                columns='2'>

                <StudentFeedbackBtn title='Good' color='green' selected={selected} setSelected={setSelected} />
                <StudentFeedbackBtn title='Confused' color='red' selected={selected} setSelected={setSelected} />
                <StudentFeedbackBtn title='Too Fast' color='orange' selected={selected} setSelected={setSelected} />
                <StudentFeedbackBtn title='Chilling' color='twitter' selected={selected} setSelected={setSelected} />
            </SimpleGrid>
        </Center>
    )
}

export default StudentFeedbackGrid