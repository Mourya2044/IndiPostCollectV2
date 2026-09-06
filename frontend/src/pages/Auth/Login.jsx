import React, { useEffect, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import Input from "../../components/inputs/Input";
import { useNavigate, Link } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useAuthStore } from "../../store/useAuthStore.js";

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

    if (!validateEmail(email)) {
      setError("Please enter valid email address");
      return;
    }
    if (!password) {
      setError("Please enter password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setIsUnverified(false);
    setResendStatus("");
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid email or password");
      } else if (error.response?.status === 403) {
        setError("Your account is not verified. Please check your email inbox and spam folder.");
        setIsUnverified(true);
      } else if (error.response?.status === 500) {
        setError("Internal server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleResendFromLogin = async () => {
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address first.");
      return;
    }
    setError("");
    setResendStatus("");
    try {
      await resendVerification(email);
      setResendStatus("Verification email sent! Please check your inbox and spam folder.");
      setResendCountdown(60);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend verification email.";
      setError(msg);
    }
  };

  return (
    <div>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-IPCaccent">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Please enter details to login
          </p>

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={({ target }) => {
                setEmail(target.value);
                setIsUnverified(false);
              }}
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

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            {isUnverified && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                <p className="mb-2">Need a new verification link?</p>
                <button
                  type="button"
                  onClick={handleResendFromLogin}
                  disabled={isLoading || resendCountdown > 0}
                  className="font-semibold text-IPCaccent hover:text-IPCprimary underline disabled:text-gray-400 cursor-pointer"
                >
                  {resendCountdown > 0
                    ? `Resend available in ${resendCountdown}s`
                    : isLoading
                    ? "Sending..."
                    : "Resend Verification Email"}
                </button>
              </div>
            )}

            {resendStatus && (
              <p className="text-green-600 text-xs pb-2.5 font-medium">{resendStatus}</p>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!validateEmail(email)) {
                  setError("Enter your email first to get reset link.");
                  return;
                }

                try {
                  await forgetPassword(email);
                  setError("Reset link sent! Check your email.");
                } catch (err) {
                  setError("Failed to send reset link.");
                }
              }}
              className="font-medium text-IPCaccent underline text-[13px] hover:text-IPCsecondary mt-3"
            >
              Forgot password?
            </button>
            <p className="text-[13px] mt-3 text-slate-800">
              Do not have an account?{" "}
              <Link
                className="font-medium text-IPCaccent underline"
                to="/signup"
              >
                SignUp
              </Link>
            </p>
          </form>
        </div>
      </AuthLayout>
    </div>
  );
};

export default Login;
