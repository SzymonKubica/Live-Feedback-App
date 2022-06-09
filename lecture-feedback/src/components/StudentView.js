import React, { useEffect } from "react";
import { socket, SocketContext } from "../context/socket";
import { ToggleButton } from "./ToggleButton";
import { Link } from "react-router-dom";

import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Button,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const StudentView = () => {
    return(
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end" />
                Hello Mr Student
            <SocketContext.Provider value={socket}>
                <ToggleButton reaction="good"/>            
                <ToggleButton reaction="confused"/>            
                <ToggleButton reaction="too fast"/>            
                <ToggleButton reaction="chilling"/>            
                  <Link to="/">
                    <Button onClick={() => socket.emit("disconnect student")}>Home</Button>
                  </Link>
            </SocketContext.Provider>
            </Grid>
            </Box>
        </ChakraProvider>
    )
}