import Button from '@chakra-ui/react';
import {socket, SocketContext} from '../context/socket'
import React from 'react';

const ResetButton = () => {
  return (
        <SocketContext.Provider value={socket}>
        <Button
          onClick={() => {
            socket.emit('reset database');
            socket.emit('connect teacher');
          }}
        >
          Reset
        </Button>
        </SocketContext.Provider>
  );
};

export default ResetButton;