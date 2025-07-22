import { useState } from 'react'
import Home from './pages/Home'
import NavBar from './components/common/NavBar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/signup'
import Dashboard from './pages/Dashboard'
import Profile from './components/core/Profile'
import CreatedJobs from './components/core/CreatedJobs'
import AppliedCandidates from './components/core/AppliedCandidates'
import Settings from './components/core/Settings'
import CreateJob from './components/core/CreateJob'
import EditProfile from './components/core/EditProfile'
import Jobs from './pages/Jobs'
import JobContent from './pages/JobContent'
import AppliedJobs from './components/core/AppliedJobs'
import EditJob from './components/core/EditJob'
import Error from './pages/Error'
import Footer from './components/common/Footer'
import { Toaster } from "sonner";

function App() {
  const location = useLocation();

  // Hide NavBar only on /dashboard and its nested routes
  const hideNavBar = location.pathname.startsWith('/dashboard');
  return (
    <>
      {!hideNavBar && <NavBar />}
      <Toaster richColors position="bottom-right" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/jobs/' element={<Jobs />} />
        <Route path='/jobs/:jobId' element={<JobContent />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<Dashboard />}>

          <Route path='profile' element={<Settings />} />
          <Route path='profile/editprofile' element={<EditProfile />} />
          <Route path='jobs/create' element={<CreateJob />} />
          <Route path='jobs/created' element={<CreatedJobs />} />
          <Route path='jobs/created/edit/:jobId' element={<EditJob />} />
          <Route path='jobs/appliedUsers/:jobId' element={<AppliedCandidates />} />
          <Route path='jobs/appliedJobs' element={<AppliedJobs />} />

        </Route>
        <Route path='*' element={<Error />} />
      </Routes>
      {!hideNavBar && <Footer />}
    </>
  )
}

export default App
