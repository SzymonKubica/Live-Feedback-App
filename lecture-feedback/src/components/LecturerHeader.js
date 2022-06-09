import { Flex, Spacer, Button, Switch } from '@chakra-ui/react';
import React from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import HomeButton from './HomeBtn';
import PercentageSwitcher from './PercentageSwitcher';
import { useLocation } from 'react-router-dom';
import { socket, SocketContext } from '../context/socket';

const Header = () => {
  const location = useLocation();

  return (
    <Flex width="100%">
      {location.pathname !== '/' && <HomeButton />}
      <Spacer />
      <PercentageSwitcher />
      <SocketContext.Provider value={socket}>
        <Button
          onClick={() => {
            socket.emit('reset database');
          }}
        >
          Reset
        </Button>
      </SocketContext.Provider>
      <ColorModeSwitcher />
    </Flex>
  );
};

export default Header;
