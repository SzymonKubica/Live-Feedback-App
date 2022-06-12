import { Center, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import StudentFeedbackBtn from './StudentFeedbackBtn'
import Reaction from './Reactions'


const StudentFeedbackGrid = ({selected, setSelected}) => {
    return (
        <Center width='100%' height='calc(85vh)'>
            <SimpleGrid
                marginBlock='5%'
                width='90%'
                height='90%'
                columns='2'>

                <StudentFeedbackBtn title='Good' color='green' reaction={Reaction.GOOD} selected={selected} setSelected={setSelected}/>
                <StudentFeedbackBtn title='Confused' color='red' reaction={Reaction.CONFUSED} selected={selected} setSelected={setSelected}/>
                <StudentFeedbackBtn title='Too Fast' color='orange' reaction={Reaction.TOO_FAST} selected={selected} setSelected={setSelected}/>
                <StudentFeedbackBtn title='Chilling' color='twitter' reaction={Reaction.CHILLING} selected={selected} setSelected={setSelected}/>
            </SimpleGrid>
        </Center>
    )
}

export default StudentFeedbackGrid