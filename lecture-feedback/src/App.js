import React, {useState, useEffect}from 'react';
import {SocketContext, socket} from './context/socket';
import { ButtonSocketComponent } from './components/test/buttonSocket';

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
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';

function App() {
  const [state, setState] = useState("")
 
  useEffect(() => {
    fetch("/test").then(res => res.json()).then(data=> {
      setState(data.test)
    })
  },[])

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <p>your random number is {state}</p>
        
        <SocketContext.Provider value={socket}>
          <ButtonSocketComponent/>
        </SocketContext.Provider>
        
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
