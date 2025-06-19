import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/HomePage'


const AppRoutes = () => {
  return (
    <Routes> 
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default AppRoutes