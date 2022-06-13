import React, { useState, useEffect, Fragment } from "react"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { HomeView } from "./components/Home/HomeView"
import { StudentView } from "./components/Student/StudentView"
import { TeacherView } from "./components/Teacher/TeacherView"
import { SnapshotView } from "./components/Teacher/SnapshotView"

function App() {
  const [state, setState] = useState("")

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="student" element={<StudentView />} />
          <Route path="teacher" element={<TeacherView />} />
          <Route path="teacher/snapshots" element={<SnapshotView />} />
        </Routes>
      </Fragment>
    </Router>
  )
}

export default App
