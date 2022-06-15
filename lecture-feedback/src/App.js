import React, { useState, useEffect, Fragment } from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { HomeView } from "./components/Home/HomeView"
import { StudentView } from "./components/Student/StudentView"
import { TeacherView } from "./components/Teacher/TeacherView"
import { SnapshotView } from "./components/Teacher/SnapshotView"
import { TeacherMenu } from "./components/Teacher/TeacherMenu"

function App() {
  const [state, setState] = useState("")

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="student/meeting/:code" element={<StudentView />} />
          <Route path="teacher/meeting/:code" element={<TeacherView />} />
          <Route path="teacher/snapshots" element={<SnapshotView />} />
          <Route path="teacher/menu" element={< TeacherMenu/>} />
        </Routes>
      </Fragment>
    </Router>
  )
}

export default App
