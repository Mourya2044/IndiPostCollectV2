import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { useAuthStore } from './store/useAuthStore'
import Learn from './pages/LearnPage'
import MarketplacePage from './pages/MarketplacePage'
import StampDetailPage from './pages/StampDetailPage'
import ProfilePage from './pages/ProfilePage'
import MuseumPage from './pages/MuseumPage';
import MuseumStampPage from './pages/MuseumStampPage';
import CommunityPage from './pages/CommunityPage'
import CommunityPostPage from './pages/CommunityPostPage'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
      <Route path='/learn' element={<Learn />} />

      <Route path='/museum' element={<MuseumPage />} />
      <Route path='/museum/:stampId' element={<MuseumStampPage />} />

      <Route path='/marketplace' element={<MarketplacePage />} />
      <Route path='/marketplace/:stampId' element={<StampDetailPage />} />

      <Route path='/events' element={<div>events page</div>} />
      <Route path='/profile' element={<ProfilePage />} />

      <Route path='/community' element={user ? <CommunityPage />: <Navigate to="/login" />} />
      <Route path='/community/:postId' element={user ? <CommunityPostPage /> : <Navigate to="/login" />} />

      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes