import React, {useState, useEffect, Fragment}from 'react';
import { 
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"  

import { StudentView } from './components/StudentView';
import { SimpleStudentView } from './components/SimpleStudentView';
import { LecturerView } from './components/LecturerView';

function App() {
  const [state, setState] = useState("")
 
  useEffect(() => {
    fetch("/test").then(res => res.json()).then(data=> {
      setState(data.test)
    })
  },[])

  return (
    <div>
    <Router>
      <Fragment> 
      <Routes>
        <Route path="student" element={<StudentView />}/>
        <Route path="lecturer" element={<LecturerView />}/>
        <Route path="simpleStudent" element={<SimpleStudentView />}/>
      </Routes>
      </Fragment>
    </Router>
    </div>
  );
}

export default App;
