import { Flex, Spacer, Button, Switch } from '@chakra-ui/react';
import React from 'react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import HomeButton from './HomeBtn';
import { useLocation } from 'react-router-dom';
import { socket, SocketContext } from "../context/socket";

const PercentageSwitcher = () => {
  const location = useLocation();

  return (
      <div> Show percentages  
        <Switch id='show percentages' />
      </div> 
  );
  }

export default PercentageSwitcher;