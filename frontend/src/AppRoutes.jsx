import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { useAuthStore } from './store/useAuthStore'
import Learn from './pages/LearnPage'
import MarketplacePage from './pages/MarketplacePage'
import StampDetailPage from './pages/StampDetailPage'
import Profile from './pages/Profile'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path='/learn' element={<Learn />} />
      <Route path='/community' element={!user ? <div>Community Page</div> : <Navigate to="/login" />} />
      <Route path='/museum' element={<div>Museum Page</div>} />
      <Route path='/marketplace' element={<MarketplacePage />} />
      <Route path='/marketplace/:stampId' element={<StampDetailPage />} />
      <Route path='/events' element={!user ? <div>events page</div> : <Navigate to="/login" />} />
      <Route path='/profile' element={user ? <Profile/> : <Navigate to="/login" />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes