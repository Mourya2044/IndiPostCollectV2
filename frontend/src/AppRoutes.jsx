import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { useAuthStore } from './store/useAuthStore'
import Learn from './pages/LearnPage'
import MarketplacePage from './pages/MarketplacePage'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path='/learn' element={<Learn />} />
      <Route path='/community' element={!user ? <div>Community Page</div> : <Navigate to="/login" />} />
      <Route path='/museum' element={!user ? <div>Museum Page</div> : <Navigate to="/login" />} />
      <Route path='/marketplace' element={!user ? <MarketplacePage /> : <Navigate to="/login" />} />
      <Route path='/events' element={!user ? <div>Events Page</div> : <Navigate to="/login" />} />
      <Route path='/profile' element={user ? <div>Profile Page</div> : <Navigate to="/login" />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes