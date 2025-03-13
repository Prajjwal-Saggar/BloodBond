import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const [userType, setUserType] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const endpoint = userType === "user" ? "login/user" : "login/hospital";
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Login failed');
      }

      localStorage.setItem('token', result.token);
      localStorage.setItem('userType', userType);
      localStorage.setItem('userName', result.userName); // Store userName

      // Redirect based on user type
      if (userType === "user") {
        navigate('/user-dashboard');
      } else {
        navigate('/hospital-dashboard');
      }
      
    } catch (err) {
      console.error('Error:', err.message);
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-white text-white p-6">
      <motion.div
        className="bg-[#223634] p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        {/* User Type Selection */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            type="button"
            onClick={() => setUserType("user")}
            className={`px-4 py-2 rounded-lg ${
              userType === "user"
                ? "bg-[#fb4673] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setUserType("hospital")}
            className={`px-4 py-2 rounded-lg ${
              userType === "hospital"
                ? "bg-[#fb4673] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Hospital
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="flex items-center text-lg">
              <Mail className="mr-2 text-[#fb4673]" />
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
              placeholder="example@mail.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center text-lg">
              <Lock className="mr-2 text-[#fb4673]" />
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="mr-2"
              />
              <label className="text-lg">Remember Me</label>
            </div>
            <Link
              to="/forgot-password"
              className="text-[#28bca9] text-sm underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#fb4673] hover:bg-[#28bca9] py-3 mt-4 rounded-lg text-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link 
            to="/signup" 
            className={`text-[#28bca9] underline ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </section>
  );
};

export default Login;
