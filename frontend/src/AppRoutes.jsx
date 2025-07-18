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
import VerificationPage from './pages/Auth/VerificationPage'
import ForgetPassword from './pages/Auth/ForgetPassword'
import CartPage from './pages/CartPage'
import PaymentSuccess from './pages/Payment/PaymentSuccess'
import PaymentFailed from './pages/Payment/PaymentFailed'
import CheckoutPage from './pages/CheckoutPage'
import ReturnPage from './pages/ReturnPage'
import AdminPage from './pages/AdminPage'
import EventsPage from './pages/EventsPage'


const AppRoutes = () => {
  const { user } = useAuthStore();

  return (
    <Routes> 
      <Route path="/" element={<Home />} />
      <Route path='/signup' element={!user ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/login' element={!user ? <Login /> : <Navigate to="/" />} />
      
      <Route path="/forget-password/:token" element={<ForgetPassword/>}/>
      <Route path='/verify/:userId/:uniqueString' element={<VerificationPage />} />

      <Route path='/learn' element={<Learn />} />

      <Route path='/museum' element={<MuseumPage />} />
      <Route path='/museum/:stampId' element={<MuseumStampPage />} />

      <Route path='/marketplace' element={<MarketplacePage />} />
      <Route path='/marketplace/:stampId' element={<StampDetailPage />} />

      <Route path='/events' element={<EventsPage/>} />
      <Route path='/profile' element={user ? <ProfilePage /> : <Navigate to="/login" />} />

      <Route path='/community' element={user ? <CommunityPage />: <Navigate to="/login" />} />
      <Route path='/community/:postId' element={user ? <CommunityPostPage /> : <Navigate to="/login" />} />

      <Route path='/cart' element={<CartPage />} />

      <Route path='/checkout' element={<CheckoutPage />} />
      <Route path='/return' element={<ReturnPage />} />

      <Route path='/payment-success' element={<PaymentSuccess/>}/>
      <Route path='/payment-failed' element={<PaymentFailed/>}/>

      <Route path='/admin' element={user && user.type === 'admin' ? <AdminPage /> : <Navigate to="/" />} />

      <Route path='*' element={<div>404 Not Found</div>} />
    </Routes>
  )
}

export default AppRoutes