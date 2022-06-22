import React, { useState, useEffect, Fragment } from "react"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation} from "react-router-dom"

import { HomeView } from "./components/Home/HomeView"
import { StudentView } from "./components/Student/StudentView"
import { TeacherView } from "./components/Teacher/TeacherView"
import { SnapshotView } from "./components/Teacher/SnapshotView"
import { TeacherMenu } from "./components/Teacher/TeacherMenu"
import { TeacherLogin } from "./components/Teacher/TeacherLogin"
import { TeacherSignup } from "./components/Teacher/TeacherSignup"
import { PanoptoView } from "./components/Teacher/PastAnalysis/PanoptoView"
import { Box, Center} from "@chakra-ui/react"
import { PresentationFileFinder } from "./components/Teacher/Finder"
import { AnalysisView } from "./components/Teacher/PastAnalysis/AnalysisView"


function RequireAuth({ children, isAuth, isLoading}) {
  // let auth = useAuth();
  let location = useLocation();
  
  // We do not want to redirect while we are waiting to check authentication asynchronously 
  if (isLoading) {
    return <Box></Box>
  }
  
  if (!isAuth) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/teacher/login" state={{ from: location }} />;
  } 

  return children
}

function App() {
  const [isAuth, setAuth] = useState(false);
  const [isLoading, setLoading] = useState(true); //intermediate when trying to fetch
  
  useEffect(() => {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    fetch("/api/authenticated", requestOptions)
    .then(res => res.json())
    .then(data => {
        if (data["authenticated"]) {
            setAuth(true)
        }
        setLoading(false)
    })
    }, [])

  return (
    <Router>
      <Fragment>
        <Routes>
          <Route path="" element={<HomeView />} />
          <Route path="student/meeting/:code" element={<StudentView/>} />
          <Route path="teacher/meeting/:code" element={
            <RequireAuth isAuth={isAuth} isLoading={isLoading}>
              <TeacherView isAuth={isAuth} setAuth={setAuth}/>
            </RequireAuth>
          }/>
          <Route path="teacher/snapshots" element={<SnapshotView isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/login" element={<TeacherLogin isAuth={isAuth} setAuth={setAuth}/>} />
          <Route path="teacher/signup" element={<TeacherSignup isAuth={isAuth} setAuth={setAuth} />} />
          <Route path="teacher/menu" element={
            <RequireAuth isAuth={isAuth} isLoading={isLoading}>
              <TeacherMenu isAuth={isAuth} setAuth={setAuth}/>
            </RequireAuth>
          }/>

          <Route path="teacher/panopto" element={
            <RequireAuth isAuth={isAuth} isLoading={isLoading}>
              <PanoptoView isAuth={isAuth} setAuth={setAuth}/>
            </RequireAuth>
          }/>

          <Route path="teacher/analysis" element={
            <RequireAuth isAuth={isAuth} isLoading={isLoading}>
              <Center>
                <PresentationFileFinder isAuth={isAuth} setAuth={setAuth} allowSave={false} />
              </Center>
            </RequireAuth>
          }/>

          <Route path="teacher/analysis/:code" element={
            <RequireAuth isAuth={isAuth} isLoading={isLoading}>
              <AnalysisView isAuth={isAuth} setAuth={setAuth} />
            </RequireAuth>
          }/>
        </Routes>
      </Fragment>
    </Router>
  )
}

export default App
