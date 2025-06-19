import React from 'react'
import AppRoutes from './AppRoutes.jsx'
import './App.css'
import Navbar from './components/Navbar.jsx'

const App = () => {
  return (
    <div>
      <Navbar />
      <AppRoutes />
    </div>
  )
}

export default App