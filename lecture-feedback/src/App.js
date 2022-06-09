import React, {useState, useEffect, Fragment}from 'react';

import { HomeView } from './components/HomeView';

function App() {
  const [state, setState] = useState("")
 
  useEffect(() => {
    fetch("/test").then(res => res.json()).then(data=> {
      setState(data.test)
    })
  },[])

  return (
    <HomeView />
  );
}

export default App;
