import React, {useState, useEffect} from "react";
import { Button, ButtonGroup } from '@chakra-ui/react'
import { socket, SocketContext } from "../context/socket";
import { SocketButton } from "./SocketButton";

import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const StudentView = () => {
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