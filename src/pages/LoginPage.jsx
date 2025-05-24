"use client"

import { useState } from "react"
import LoginForm from "../components/auth/LoginForm"
import SignupForm from "../components/auth/SignupForm"

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="text-center p-8 pb-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          <h1 className="text-3xl font-bold mb-2">Agent-AI</h1>
          <p className="opacity-90 text-sm">Your gateway to career opportunities</p>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 p-4 font-medium transition-all ${
              isLogin ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 p-4 font-medium transition-all ${
              !isLogin ? "text-blue-600 bg-gray-50 border-b-2 border-blue-600" : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <div className="p-8">{isLogin ? <LoginForm /> : <SignupForm />}</div>
      </div>
    </div>
  )
}

export default LoginPage
