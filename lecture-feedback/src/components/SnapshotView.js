import { Box, ChakraProvider, Heading, Progress, Stack, Button } from '@chakra-ui/react'
import React, {useState, useEffect} from 'react'
import LecturerHeader from './LecturerHeader'
import { socket } from "../context/socket";
import TeacherFeedbackBar from './TeacherFeedbackBar'

import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

export const SnapshotView = () => {
    const [snapshots, setSnapshots] = useState({});
    const [tableBody, setTableBody] = useState(<Tbody></Tbody>);

    useEffect(() => {
        fetch("/api/snapshots").then(res => res.json()).then(data=> {
            setSnapshots(data.snapshots);
            setTableBody(
            <Tbody>            
                    {Object.keys(snapshots).map(key => {
                        console.log(key);
                        return(<Tr key={key}>
                            <Td>{JSON.stringify(snapshots[key].start)}</Td>
                            <Td>{JSON.stringify(snapshots[key].end)}</Td>
                            <Td>{snapshots[key].summarised_data.confused}</Td>
                            <Td>{snapshots[key].summarised_data.good}</Td>
                            <Td>{snapshots[key].summarised_data["too-fast"]}</Td>
                            <Td>{snapshots[key].summarised_data.chilling}</Td>
                        </Tr> )
                    })}            
            </Tbody>
            )
        })
    },[]) 
    
    return (
        <ChakraProvider>
            <TableContainer>
                <Table size='sm'>
                    <Thead>
                    <Tr>
                     <Th>Start</Th>
                     <Th>End</Th>
                     <Th>Confused</Th>
                     <Th>Good</Th>
                     <Th>Too Fast</Th>
                     <Th>Chilling</Th>
                    </Tr>
                    </Thead>
                    {tableBody}
                </Table>
            </TableContainer>
        </ChakraProvider>
    )
}