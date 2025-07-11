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

  const navigate = useNavigate();
  const {
    login,
    hideNav,
    unhideNav,
    hideFooter,
    unhideFooter,
    forgetPassword,
  } = useAuthStore();

  useEffect(() => {
    hideNav();
    hideFooter();

    return () => {
      unhideNav();
      unhideFooter();
    };
  }, [hideNav, unhideNav, hideFooter, unhideFooter]);

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
    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      if (error.response.status === 401) {
        setError("Invalid email or password");
      } else if (error.response.status === 403) {
        setError("Your account is not verified. Please check your email.");
      } else if (error.response.status === 500) {
        setError("Internal server error. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <AuthLayout>
        <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
          <h3 className="text-2xl font-semibold text-IPCaccent">Welcome Back</h3>
          <p className="text-xs text-slate-700 mt-[5px] mb-6">
            Please enter details in login
          </p>

          <form onSubmit={handleLogin}>
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="philatelist@gmail.com"
              label="Email Address"
              type="text"
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Minimun 8 characters"
              label="Password"
              type="password"
            />

            {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

            <button type="submit" className="btn-primary">
              Login
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
              Do not have an account?{""}
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
