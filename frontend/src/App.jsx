import React, { useEffect } from 'react'
import AppRoutes from './AppRoutes.jsx'
import './App.css'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import Footer from './components/Footer.jsx'

const App = () => {
  const {checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  

  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  )
}

export default App