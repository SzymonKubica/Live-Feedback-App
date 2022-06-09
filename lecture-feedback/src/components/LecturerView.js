import React, { useEffect } from "react";
import { socket, SocketContext } from "../context/socket";
import { SocketCounter } from "./SocketCounter";
import { Link } from "react-router-dom"
import { Button} from '@chakra-ui/react'

import {
  ChakraProvider,
  Box,
  Grid,
  GridItem,
  Button,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const LecturerView = () => {
    return(
        <ChakraProvider theme={theme}>
            <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end" />
            Hello Mr Lecturer
            <SocketContext.Provider value={socket}>
                <Grid>
                    <GridItem>
                        <SocketCounter reaction="good"/>
                    </GridItem>
                    <GridItem>
                        <SocketCounter reaction="confused"/>
                    </GridItem>
                    <GridItem>
                        <SocketCounter reaction="too fast"/>
                    </GridItem>
                    <GridItem>
                        <SocketCounter reaction="chilling"/>
                    </GridItem>
                  <Link to="/">
                    <Button>Home</Button>
                  </Link>
                </Grid>
            </SocketContext.Provider>
            </Grid>
            </Box>
        </ChakraProvider>
    )
}