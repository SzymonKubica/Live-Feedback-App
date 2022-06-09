import React from 'react';
import { socket, SocketContext } from '../context/socket';
import { SocketCounter } from './SocketCounter';
import { Link } from 'react-router-dom';

import { ChakraProvider, Box, Grid, Button, theme, VStack, Heading, Stack, Center } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import NavBtn from './NavBtn';
import Header from './Header';



export const HomeView = () => {
  return (
    <ChakraProvider theme={theme}>
      <Stack>
        <Header />
        <VStack spacing='20px' marginTop='10px'>
          <Heading>Home</Heading>
          <NavBtn dst="Student" />
          <NavBtn dst="Teacher" />
        </VStack>
      </Stack>
    </ChakraProvider >
  );
};
