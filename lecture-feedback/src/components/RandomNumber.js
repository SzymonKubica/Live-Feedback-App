import React, { useState, useEffect }from 'react';

import {
  ChakraProvider,
  Box,
  Grid,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';

export const RandomNumber = () => {
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
        </Grid>
      </Box>
    </ChakraProvider>
  );
}
