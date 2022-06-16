import React, { useState, useEffect, Fragment } from "react"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom"

import { HomeView } from "./components/Home/HomeView"
import { StudentView } from "./components/Student/StudentView"
import { TeacherView } from "./components/Teacher/TeacherView"
import { SnapshotView } from "./components/Teacher/SnapshotView"
import { TeacherMenu } from "./components/Teacher/TeacherMenu"
import { TeacherLogin } from "./components/Teacher/TeacherLogin"
import { TeacherSignup } from "./components/Teacher/TeacherSignup"

function RequireAuth({ children, isAuth }) {
  // let auth = useAuth();
  let location = useLocation();

  if (!isAuth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/teacher/login" state={{ from: location }} />;
  }

  return children;
}

function App() {
  const [isAuth, setAuth] = useState(false);

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="student/meeting/:code" element={<StudentView/>} />
          <Route path="teacher/meeting/:code" element={
            <RequireAuth isAuth={isAuth}>
              <TeacherView isAuth={isAuth} setAuth={setAuth}/>
            </RequireAuth>
          }/>
          <Route path="teacher/snapshots" element={<SnapshotView isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/login" element={<TeacherLogin isAuth={isAuth} setAuth={setAuth}/>} />
          <Route path="teacher/signup" element={<TeacherSignup isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/menu" element={
            <RequireAuth isAuth={isAuth}>
              <TeacherMenu isAuth={isAuth} setAuth={setAuth}/>
            </RequireAuth>
          }/>
        </Routes>
      </Fragment>
    </Router>
  )
}

export default App
