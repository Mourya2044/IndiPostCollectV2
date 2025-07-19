import { BubbleEffect } from "@/components/BubbleEffect";
import Input from "@/components/inputs/Input";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const { token } = useParams();
  const { resetPassword, isLoading, hideNav, unhideNav, hideFooter, unhideFooter } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    hideNav();
    hideFooter();

    return () => {
      unhideNav();
      unhideFooter();
    };
  }, [hideNav, unhideNav, hideFooter, unhideFooter]);

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
    } else if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
    } else {
      try {
        await resetPassword(password, token);
        setMessage("Password successfully updated");
        setPassword("");
        setConfirm("");

        setTimeout(() => {
          navigate("/login")
        }, 1500);
      } catch (error) {
        console.error("Error resetting password:", error);
        setMessage(error.response?.data?.message || "An error occurred while resetting the password.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-IPCaccent">Reset Password</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter and confirm your new password.
        </p>

        <form onSubmit={handleReset}>
          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            placeholder="Minimum 8 characters"
            label="New Password"
            type="password"
          />
          <Input
            value={confirm}
            onChange={({ target }) => setConfirm(target.value)}
            placeholder="Confirm your new password"
            label="Confirm Password"
            type="password"
          />

          {/* Using the same style as the login page's error for consistency */}
          {message && (
            <p className="text-red-500 text-xs pb-2.5">{message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary ${isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
