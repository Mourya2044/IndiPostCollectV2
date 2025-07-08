import { axiosInstance } from "@/lib/axios";
import React, { useState, useEffect } from "react";
import {loadStripe} from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

const ReturnPage = () => {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    const fetchData = async () => {
      const response = await axiosInstance.get(`/stripe/session-status?session_id=${sessionId}`);
      const data = response.data;
      setStatus(data.status);
      setCustomerEmail(data.customer_email);
    };

    fetchData();
  }, []);

  if (status === 'open') {
    return (
      <Navigate to="/checkout" />
    )
  }

  if (status === 'complete') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg shadow-md animate-bounce">
        <strong className="font-bold">Payment Successful</strong>
        <span className="block">Thank you for your purchase!</span>
      </div>
    </div>
    )
  }

  return null;
}

export default ReturnPage;