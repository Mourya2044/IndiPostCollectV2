import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'


const AppRoutes = () => {
  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/signUp" element={<SignUp/>}/>
    </Routes>
  )
}

export default AppRoutes