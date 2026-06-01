import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Lock,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  ReceiptIndianRupee,
} from "lucide-react";
import loginleft from "../assets/loginleft.jpeg";
import logo from "../assets/logo.png";
import loginb1 from "../assets/loginb1.png";
import loginb3 from "../assets/loginb3.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Main Layout */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Section */}
        <div className="bg-[#fafafa] border-r border-gray-200 flex flex-col justify-between p-8 lg:p-10">
          {/* Logo */}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold">
              <img
                src={logo}
                alt="Logo"
                className="w-16 h-16 inline-block mr-3"
              />
              Split <span className="text-red-500">Expense</span>
            </h1>

            <p className="text-gray-500 mt-2 text-base lg:text-lg">
              Split costs. Save friendships.
            </p>
          </div>

          {/* Illustration */}
          <div className="flex justify-center items-center flex-1 py-8">
            <img
              src={loginleft}
              alt="illustration"
              className="w-[240px] lg:w-[320px] object-contain"
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-5 text-center">
            {/* Feature 1 */}
            <div>
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 text-xl">
                <img src={loginb1} alt="loginb1" />
              </div>

              <h3 className="font-semibold text-base">Group Expenses</h3>

              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Add friends and create groups easily
              </p>
            </div>

            {/* Feature 2 */}
            <div>
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3 text-xl">
                <ReceiptIndianRupee size={34} className="text-green-500" />
              </div>

              <h3 className="font-semibold text-base">Track & Settle</h3>

              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Track every expense and settle up
              </p>
            </div>

            {/* Feature 3 */}
            <div>
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3 text-xl">
                <img src={loginb3} 
                alt="loginb3" />
              </div>

              <h3 className="font-semibold text-base">Clear & Simple</h3>

              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                See who owes what instantly
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-lg">
            {/* Heading */}
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Welcome Back!
              </h2>

              <p className="text-gray-500 text-lg mt-3">
                Login to continue to your account
              </p>
            </div>

            {/* Phone Number */}
            <div className="mb-7">
              <label className="text-base font-medium text-gray-700">
                Phone Number
              </label>

              <div className="mt-3 flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-red-400 transition">
                <Phone size={20} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  className="w-full outline-none ml-4 text-base bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="text-base font-medium text-gray-700">
                Password
              </label>

              <div className="mt-3 flex items-center border border-gray-300 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-red-400 transition">
                <Lock size={20} className="text-gray-400" />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none ml-4 text-base bg-transparent"
                />

                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-8">
              <button className="text-red-500 hover:underline text-sm">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:opacity-95 text-white py-3 rounded-xl font-semibold text-lg shadow-lg transition">
              Login
            </button>

            {/* Signup */}
            <p className="text-center text-gray-500 text-base mt-12">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-red-500 font-semibold cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>
            {/* Footer */}
            <div className="flex items-center justify-center gap-2 mt-12 text-gray-400 text-sm">
              <ShieldCheck size={16} />

              <p>Your data is safe and secure with us.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
