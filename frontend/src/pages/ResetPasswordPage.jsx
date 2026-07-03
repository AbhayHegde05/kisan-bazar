"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { resetPassword, clearError } from "../redux/slices/authSlice";

import { FaLock } from "react-icons/fa";

function useQueryToken() {
  const location = useLocation();
  return new URLSearchParams(location.search).get("token");
}

export default function ResetPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useQueryToken();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localMessage, setLocalMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage("");
    setPasswordError("");

    if (!token) {
      setPasswordError("Reset token missing from URL.");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    const res = await dispatch(resetPassword({ token, password }));

    if (resetPassword.fulfilled.match(res)) {
      setLocalMessage(res.payload?.message || "Password updated successfully");
      setTimeout(() => navigate("/login"), 1200);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass p-10 rounded-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <FaLock className="text-green-500 text-4xl" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choose new password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your reset link token is valid for a short time.
          </p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {passwordError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{passwordError}</span>
          </div>
        )}

        {localMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded relative"
            role="status"
          >
            <span className="block sm:inline">{localMessage}</span>
          </div>
        )}

        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter new password"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Update password
          </button>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-medium text-green-600 hover:text-green-500"
            >
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

