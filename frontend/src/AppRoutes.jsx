import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { useAuthStore } from './store/useAuthStore'
import Learn from './pages/LearnPage'
import MarketplacePage from './pages/MarketplacePage'
import StampDetailPage from './pages/StampDetailPage'
import MuseumStampPage from './pages/MuseumStampPage'
import MuseumPage from './pages/MuseumPage'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path='/learn' element={<Learn />} />
      <Route path='/community' element={<div>Community Page</div>} />
      <Route path='/museum' element={<MuseumPage />} />
      <Route path='/museum/:stampId' element={<MuseumStampPage />} />
      <Route path='/marketplace' element={<MarketplacePage />} />
      <Route path='/marketplace/:stampId' element={<StampDetailPage />} />
      <Route path='/events' element={!user ? <div>Events Page</div> : <Navigate to="/login" />} />
      <Route path='/profile' element={user ? <div>Profile Page</div> : <Navigate to="/login" />} />
      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes