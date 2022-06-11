import { Flex, Spacer, Button, Switch } from '@chakra-ui/react';
import React from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import HomeButton from './HomeBtn';
import PercentageSwitcher from './PercentageSwitcher';
import { useLocation } from 'react-router-dom';
import { socket, SocketContext } from '../context/socket';
import NavBtn from './NavBtn';


const TeacherHeader = () => {
  const location = useLocation();

  return (
    <Flex width="100%">
      {location.pathname !== '/' && <HomeButton />}
      <Spacer />
      {/* <PercentageSwitcher /> */}
      <SocketContext.Provider value={socket}>
        <Button
          onClick={() => {
            socket.emit('create snapshot');
          }}
        >
          Reset
        </Button>
        <NavBtn name="Snapshots" dst="snapshots" />
      </SocketContext.Provider>
      <ColorModeSwitcher />
    </Flex>
  );
};

export default TeacherHeader;
