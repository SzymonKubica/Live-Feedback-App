import React, {useState, useEffect, Fragment}from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"  

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
import { StudentView } from './components/StudentView';
import { LecturerView } from './components/LecturerView';
import { RandomNumber } from './components/RandomNumber';

function App() {
  const [state, setState] = useState("")
 
  useEffect(() => {
    fetch("/test").then(res => res.json()).then(data=> {
      setState(data.test)
    })
  },[])

  return (
    <Router>
      <Fragment> 
      <Routes>
        <Route path="student" element={<StudentView />}/>
        <Route path="lecturer" element={<LecturerView />}/>
      </Routes>
      </Fragment>
    </Router>
  );
}

export default App;
