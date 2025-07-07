import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {

  const navigate = useNavigate();

  useEffect (()=>{
    const timer = setTimeout(()=>{
        navigate('/');
    },4000)
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-md animate-bounce">
        <strong className="font-bold">Payment Successful</strong>
        <span className="block">Thank you for your purchase!</span>
      </div>
    </div>
  );
};

export default PaymentSuccess;
