import { axiosInstance } from "@/lib/axios";
import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";

const ReturnPage = () => {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');

    if (!sessionId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(`/stripe/session-status?session_id=${sessionId}`);
        setStatus(response.data.status);
      } catch (err) {
        console.error("Error fetching session status", err);
      }
    };
    fetchData();
  }, []);

  if (status === 'open') return <Navigate to="/checkout" />;

  if (status === 'complete') {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full border border-border bg-background p-8 text-center animate-in slide-in-from-bottom-4 fade-in duration-700">
          <div className="w-16 h-16 bg-IPCprimary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-IPCprimary" />
          </div>
          <h2 className="text-2xl font-light text-foreground mb-2">Payment Successful</h2>
          <p className="text-sm text-muted-foreground mb-8">Thank you for your purchase! Your order is being processed.</p>
          
          <div className="flex flex-col gap-3">
            <Link 
              to="/profile" 
              className="w-full flex justify-center items-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              View Order Details <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link 
              to="/marketplace" 
              className="w-full flex justify-center py-3 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <div className="min-h-screen bg-background" />;
}

export default ReturnPage;