import React, { useEffect, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useAuthStore } from "../../store/useAuthStore.js";
import { ArrowRight, Loader2 } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isUnverified, setIsUnverified] = useState(false);
  const [resendStatus, setResendStatus] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const navigate = useNavigate();
  const {
    login,
    hideNav,
    unhideNav,
    hideFooter,
    unhideFooter,
    forgetPassword,
    resendVerification,
    isLoading
  } = useAuthStore();

  useEffect(() => {
    hideNav();
    hideFooter();
    return () => {
      unhideNav();
      unhideFooter();
    };
  }, [hideNav, unhideNav, hideFooter, unhideFooter]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) return setError("Please enter valid email address");
    if (!password) return setError("Please enter password");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    
    setError("");
    setIsUnverified(false);
    setResendStatus("");
    
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) setError("Invalid email or password");
      else if (error.response?.status === 403) {
        setError("Your account is not verified. Please check your email inbox and spam folder.");
        setIsUnverified(true);
      } else if (error.response?.status === 500) setError("Internal server error. Please try again later.");
      else setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleResendFromLogin = async () => {
    if (!email || !validateEmail(email)) return setError("Please enter a valid email address first.");
    setError("");
    setResendStatus("");
    try {
      await resendVerification(email);
      setResendStatus("Verification email sent! Please check your inbox and spam folder.");
      setResendCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend verification email.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
        <h3 className="text-3xl font-light text-foreground mb-2">Welcome Back</h3>
        <p className="text-sm text-muted-foreground mb-8">
          Please enter your details to login.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            value={email}
            onChange={({ target }) => { setEmail(target.value); setIsUnverified(false); }}
            placeholder="philatelist@gmail.com"
            label="Email Address"
            type="text"
          />
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Minimum 8 characters"
            label="Password"
            type="password"
          />

          {error && <p className="text-red-500 text-xs font-semibold">{error}</p>}

          {isUnverified && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600/90 dark:text-amber-500">
              <p className="mb-2">Need a new verification link?</p>
              <button
                type="button"
                onClick={handleResendFromLogin}
                disabled={isLoading || resendCountdown > 0}
                className="font-semibold uppercase tracking-widest hover:text-amber-700 disabled:opacity-50 transition-colors"
              >
                {resendCountdown > 0 ? `Resend available in ${resendCountdown}s` : isLoading ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )}

          {resendStatus && <p className="text-green-600 text-xs font-medium">{resendStatus}</p>}

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full flex justify-center items-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity mt-6"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Login <ArrowRight className="h-3.5 w-3.5" /></>}
          </button>
          
          <div className="flex flex-col gap-2 mt-6">
            <button
              type="button"
              onClick={async () => {
                if (!validateEmail(email)) return setError("Enter your email first to get reset link.");
                try {
                  await forgetPassword(email);
                  setError("Reset link sent! Check your email.");
                } catch (err) {
                  setError("Failed to send reset link.");
                }
              }}
              className="text-left text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-IPCprimary transition-colors"
            >
              Forgot password?
            </button>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link className="text-xs font-semibold uppercase tracking-widest text-IPCprimary hover:text-IPCsecondary transition-colors" to="/signup">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
