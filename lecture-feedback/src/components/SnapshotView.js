import { Box, ChakraProvider, Heading, Progress, Stack, Button } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import LecturerHeader from './LecturerHeader'
import { socket } from "../context/socket";
import TeacherFeedbackBar from './TeacherFeedbackBar'

export const SnapshotView = () => {
    const [snapshots, setSnapshots] = useState({});

    useEffect(() => {
        fetch("/api/snapshots").then(res => res.json()).then(data=> {
            setSnapshots(data.snapshots);
        })
    },[]) 
    
    return (
        <ChakraProvider>
            <Stack marginStart={10} marginTop={10} width='90%' spacing='10%'>
                <p>{JSON.stringify(snapshots)}</p>
            </Stack>
        </ChakraProvider>
    )
}
