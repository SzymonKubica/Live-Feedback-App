import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [state, setState] = useState("")

  useEffect(() => {
    fetch("/test").then(res => res.json()).then(data=> {
      setState(data.test)
    })
  },[])
  
  return (
    <div className="App">
      <p>{state}</p>
    </div>
  );
}

export default App;
