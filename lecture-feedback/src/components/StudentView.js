import React, { useState } from 'react';

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
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import HomeButton from './HomeBtn';
import Header from './Header';
import StudentFeedbackBtn from './StudentFeedbackBtn';
import StudentFeedbackGrid from './StudentFeedbackGrid';

const NilButton = 'nil'

export const StudentView = () => {
    const [selected, setSelected] = useState(NilButton)

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