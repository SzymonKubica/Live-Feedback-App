import React, { useState, useEffect, Fragment } from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { HomeView } from "./components/Home/HomeView"
import { StudentView } from "./components/Student/StudentView"
import { TeacherView } from "./components/Teacher/TeacherView"
import { SnapshotView } from "./components/Teacher/SnapshotView"
import { TeacherMenu } from "./components/Teacher/TeacherMenu"
import { TeacherLogin } from "./components/Teacher/TeacherLogin"
import { TeacherSignup } from "./components/Teacher/TeacherSignup"

function App() {
  const [isAuth, setAuth] = useState(false);

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="student/meeting/:code" element={<StudentView/>} />
          <Route path="teacher/meeting/:code" element={<TeacherView isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/snapshots" element={<SnapshotView isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/login" element={<TeacherLogin isAuth={isAuth} setAuth={setAuth}/>} />
          <Route path="teacher/signup" element={<TeacherSignup isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/menu" element={< TeacherMenu isAuth={isAuth} setAuth={setAuth}/>} />
        </Routes>
      </Fragment>
    </Router>
  )
}

export default App
