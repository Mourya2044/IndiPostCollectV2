import Input from "@/components/inputs/Input";
import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";

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
    setMessage("");

    if (password !== confirm) {
      setMessage("Passwords do not match.");
    } else if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
    } else {
      try {
        await resetPassword(password, token);
        setMessage("Password successfully updated. Redirecting...");
        setPassword("");
        setConfirm("");
        setTimeout(() => navigate("/login"), 1500);
      } catch (error) {
        console.error("Error resetting password:", error);
        setMessage(error.response?.data?.message || "An error occurred while resetting the password.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md animate-in slide-in-from-bottom-4 fade-in duration-700">
        <h3 className="text-3xl font-light text-foreground mb-2">Reset Password</h3>
        <p className="text-sm text-muted-foreground mb-8">
          Please enter and confirm your new password.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
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

          {message && (
            <p className={`text-xs font-semibold ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 bg-IPCprimary text-white text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity mt-6"
          >
             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Reset Password <ArrowRight className="h-3.5 w-3.5" /></>}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
