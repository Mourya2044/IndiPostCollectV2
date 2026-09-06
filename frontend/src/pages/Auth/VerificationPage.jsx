import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import AuthLayout from "../../components/layouts/AuthLayout";

const VerificationPage = () => {
  const { userId, uniqueString } = useParams();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { checkAuth, hideNav, unhideNav, hideFooter, unhideFooter } = useAuthStore();
  const hasAttempted = useRef(false);

  useEffect(() => {
    hideNav();
    hideFooter();
    return () => {
      unhideNav();
      unhideFooter();
    };
  }, [hideNav, unhideNav, hideFooter, unhideFooter]);

  const verifyEmail = async () => {
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await axiosInstance.post(`/auth/verify/${userId}/${uniqueString}`);
      if (response.status === 200) setVerified(true);
      else setErrorMessage(response.data?.message || "Verification failed");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error verifying email. The link may have expired.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hasAttempted.current && userId && uniqueString) {
      hasAttempted.current = true;
      verifyEmail();
    }
  }, [userId, uniqueString]);

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-8 border border-border bg-background shadow-xl">
            <Loader2 className="w-10 h-10 animate-spin text-IPCprimary mb-4" />
            <h3 className="text-xl font-light text-foreground mb-2">Verifying Email</h3>
            <p className="text-sm text-muted-foreground text-center">Please wait while we confirm your email address.</p>
          </div>
        ) : verified ? (
          <div className="flex flex-col items-center justify-center p-8 border border-border bg-background shadow-xl">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Verification Complete</h3>
            <p className="text-sm text-muted-foreground text-center mb-8">Your email has been verified. You can now access all features.</p>
            <Link 
              to="/"
              onClick={checkAuth}
              className="w-full flex justify-center py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Go to Homepage
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border border-border bg-background shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Verification Failed</h3>
            <p className="text-sm text-red-500 font-medium text-center mb-2">{errorMessage}</p>
            <p className="text-xs text-muted-foreground text-center mb-8">Please try again or request a new verification email from the login page.</p>
            
            <div className="flex flex-col gap-3 w-full">
              <button 
                onClick={verifyEmail}
                className="w-full flex justify-center py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <Link 
                to="/login"
                className="w-full flex justify-center py-3 border border-border text-foreground text-xs font-semibold uppercase tracking-widest hover:bg-muted transition-colors"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

      </div>
    </AuthLayout>
  );
};

export default VerificationPage;