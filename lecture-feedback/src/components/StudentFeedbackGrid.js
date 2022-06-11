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

                <StudentFeedbackBtn title='Good' color='green' selected={selected} setSelected={setSelected} reaction={Reaction.GOOD} />
                <StudentFeedbackBtn title='Confused' color='red' selected={selected} setSelected={setSelected} reaction={Reaction.CONFUSED}/>
                <StudentFeedbackBtn title='Too Fast' color='orange' selected={selected} setSelected={setSelected} reaction={Reaction.TOO_FAST}/>
                <StudentFeedbackBtn title='Chilling' color='twitter' selected={selected} setSelected={setSelected} reaction={Reaction.CHILLING}/>
            </SimpleGrid>
        </Center>
    )
}

export default StudentFeedbackGrid