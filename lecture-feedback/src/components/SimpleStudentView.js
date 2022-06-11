import React from 'react';
import { socket, SocketContext } from '../context/socket';
import { SocketButton } from './SocketButton';
import { Link } from "react-router-dom";

import { ChakraProvider, Box, Grid, Button, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const SimpleStudentView = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          Hello Mr Simple Student
          <SocketContext.Provider value={socket}>
            <SocketButton />
        <Link to="/">
          <Button onClick={() => socket.emit("disconnect student")}>Home</Button>
        </Link>
          </SocketContext.Provider>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
