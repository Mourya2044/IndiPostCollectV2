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
import { Loader } from 'lucide-react'

const queryClient = new QueryClient();

const App = () => {
  const {checkAuth, isCheckingAuth} = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div className="flex items-center justify-center min-h-screen bg-background"><Loader className='animate-spin' /></div>
  }


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