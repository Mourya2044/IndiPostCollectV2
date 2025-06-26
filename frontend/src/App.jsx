import React, { useEffect } from 'react'
import AppRoutes from './AppRoutes.jsx'
import './App.css'
import Navbar from './components/Navbar.jsx'
import { useAuthStore } from './store/useAuthStore.js'
import Footer from './components/Footer.jsx'
import {   
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Toaster } from "@/components/ui/sonner"

const queryClient = new QueryClient();

const App = () => {
  const {checkAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth])
  

  return (
    <main className="flex flex-col min-h-screen bg-gray-100">
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <AppRoutes />
      <Toaster richColors />
      <Footer />
    </QueryClientProvider>
    </main>
  )
}

export default App