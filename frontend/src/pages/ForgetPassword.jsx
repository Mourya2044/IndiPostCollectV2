import { BubbleEffect } from "@/components/BubbleEffect";
import React, { useState, useMemo } from "react";

const ForgetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match.");
    } else if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
    } else {
      setMessage("✅ Password successfully updated (simulated)");
      // Simulate success; in real app, you'd POST to backend here
      setPassword("");
      setConfirm("");
    }
  };

  const bubbles = useMemo(() => (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <BubbleEffect />
      <BubbleEffect />
      <BubbleEffect />
    </div>
  ), []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-900 via-Postalprimary-bg to-red-800 flex items-center justify-center z-50">
        {bubbles}
      <div className="relative z-10 bg-white p-6 rounded-2xl w-full max-w-sm shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

        <form onSubmit={handleReset}>
          <label className="block mb-2 text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-Postalprimary-bg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label className="block mb-2 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-Postalprimary-bg"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-Postalprimary-bg text-white py-2 rounded-xl hover:bg-IPCsecondary transition"
          >
            Reset Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
