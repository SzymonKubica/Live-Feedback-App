import React  from "react";
import { socket, SocketContext } from "../context/socket";
import { SocketButton } from "./SocketButton";

import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const SimpleStudentView = () => {
    return(
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end" />
            <SocketContext.Provider value={socket}>
                <SocketButton/>
            </SocketContext.Provider>
            </Grid>
            </Box>
        </ChakraProvider>
    )
}