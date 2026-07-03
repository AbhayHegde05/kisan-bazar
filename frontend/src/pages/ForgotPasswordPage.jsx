"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { requestPasswordReset, clearError } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

import { FaLock, FaEnvelope } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [localMessage, setLocalMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalMessage("");
    dispatch(clearError());
    const res = await dispatch(requestPasswordReset({ email }));

    if (requestPasswordReset.fulfilled.match(res)) {
      setLocalMessage(res.payload?.message || "If the email exists, a reset link has been sent");
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Reset password</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we’ll send a reset link.
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Email address"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading}
            >
              Send reset link
            </button>
          </div>

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

