import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import { useAuthStore } from './store/useAuthStore'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default AppRoutes