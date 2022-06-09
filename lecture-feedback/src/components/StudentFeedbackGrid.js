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

                <StudentFeedbackBtn title='Good' color='green' selected={selected} setSelected={setSelected} reaction='good' />
                <StudentFeedbackBtn title='Confused' color='red' selected={selected} setSelected={setSelected} reaction='confused'/>
                <StudentFeedbackBtn title='Too Fast' color='orange' selected={selected} setSelected={setSelected} reaction='too fast'/>
                <StudentFeedbackBtn title='Chilling' color='twitter' selected={selected} setSelected={setSelected} reaction='chilling'/>
            </SimpleGrid>
        </Center>
    )
}

export default StudentFeedbackGrid