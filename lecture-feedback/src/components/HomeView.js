import React from 'react';
import { socket, SocketContext } from '../context/socket';
import { SocketCounter } from './SocketCounter';
import { Link } from 'react-router-dom';

import { ChakraProvider, Box, Grid, Button, theme } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';


export const HomeView = () => {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
                  <Link to="/">
                    <Button>Home</Button>
                  </Link>
                  <SocketContext.Provider value={socket}>
                  <Link to="/simpleStudent">
                    <Button onClick={() => socket.emit("connect student")}>Simple Student Page</Button>
                  </Link>
                  <Link to="/student">
                    <Button onClick={() => socket.emit("connect student")}>Student Page</Button>
                  </Link>
                  </SocketContext.Provider>
                  <Link to="/lecturer">
                    <Button>Lecturer Page</Button>
                  </Link>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};
