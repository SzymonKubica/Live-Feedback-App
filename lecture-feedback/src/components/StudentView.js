import React, {useState, useEffect} from 'react'
import { socket} from "../context/socket";

import { Link } from 'react-router-dom';

import {
    ChakraProvider,
    Stack,
    theme,
    Button,
    Center,
    SimpleGrid,
    Box,
    Flex,
    HStack,
    Spacer,
} from '@chakra-ui/react';
import Header from './Header';
import StudentFeedbackGrid from './StudentFeedbackGrid';

const NilButton = 'nil'

export const StudentView = () => {
    const [selected, setSelected] = useState(NilButton)

    // reset the button when lecturer creates a snapshot
    useEffect(() => {
        socket.on("reset buttons", () => {
            setSelected(NilButton)

        });

        // Disconnect when unmounts
        return () => socket.off("reset buttons");
        //

    }, [])

    return (
        <ChakraProvider theme={theme}>
            <Stack width='100%'>
                <Header />

                <StudentFeedbackGrid
                    selected={selected}
                    setSelected={setSelected} />
            </Stack>
        </ChakraProvider>
    );
}