import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import {
  Mail,
  Lock,
  Phone,
  MapPin,
  Heart,
  Hospital,
  Shield,
  UserPlus,
  Clock,
  User
} from "lucide-react";

const schema = yup.object().shape({
  name: yup.string().when("$userType", {
    is: "user",
    then: () => yup.string().required("Name is required"),
    otherwise: () => yup.string().nullable()
  }),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9]+$/, "Invalid phone number")
    .required("Phone number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .test("passwords-match", "Passwords must match", function(value) {
      return this.parent.password === value;
    }),
  location: yup.object().shape({
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required")
  }),
  bloodGroup: yup.string().when("$userType", {
    is: "user",
    then: () => yup.string().required("Blood group is required"),
    otherwise: () => yup.string().nullable()
  }),
  hospitalName: yup.string().when("$userType", {
    is: "hospital",
    then: () => yup.string().required("Hospital name is required"),
    otherwise: () => yup.string().nullable()
  }),
  registrationNumber: yup.string().when("$userType", {
    is: "hospital",
    then: () => yup.string().required("Registration number is required"),
    otherwise: () => yup.string().nullable()
  }),
  operatingHours: yup.object().when("$userType", {
    is: "hospital",
    then: () => yup.object({
      open: yup.string().required("Opening time is required"),
      close: yup.string().required("Closing time is required")
    }),
    otherwise: () => yup.object().nullable()
  }),
  emergencyContact: yup.object().when("$userType", {
    is: "hospital",
    then: () => yup.object({
      name: yup.string().required("Emergency contact name is required"),
      phone: yup.string().required("Emergency contact phone is required")
    }),
    otherwise: () => yup.object().nullable()
  })
});

const Signup = () => {
  const [userType, setUserType] = useState("user");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { 
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userType: "user" },
    context: { userType },
    mode: "onChange"
  });

  // Reset form when userType changes
  React.useEffect(() => {
    reset();
  }, [userType, reset]);

  // Modify useEffect to only fetch location for user type
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if (userType === 'user') {
          const response = await fetch('http://ip-api.com/json');
          const data = await response.json();
          if (data.status === 'success') {
            setValue('location.city', data.city);
            setValue('location.state', data.regionName);
          }
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [setValue, userType]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Verify passwords match before submitting
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Add userType to the data being sent
      const submitData = {
        ...data,
        userType: userType,
        password: data.password
      };

      // Remove unnecessary fields
      delete submitData.confirmPassword;
      if (userType === 'user') {
        delete submitData.hospitalName;
        delete submitData.registrationNumber;
        delete submitData.operatingHours;
        delete submitData.emergencyContact;
      } else {
        delete submitData.bloodGroup;
        delete submitData.name;
      }

      console.log("Submitting data:", submitData);

      const endpoint = userType === "user" ? "register/user" : "register/hospital";
      const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Signup failed");
      }

      toast.success("Signup successful! Please login to continue.");
      navigate("/login");
    } catch (err) {
      console.error("Error:", err.message);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-screen bg-white text-white p-4 sm:p-6">
      <motion.div
        className="bg-[#223634] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-4xl mt-20"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
          Sign Up
        </h2>
        {/* User Type Selection */}
        <div className="flex justify-center mb-4 sm:mb-6 space-x-2 sm:space-x-4">
          <button
            className={`px-3 sm:px-4 py-2 font-semibold rounded-lg cursor-pointer ${
              userType === "user"
                ? "bg-[#fb4673] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("user")}
          >
            Signup as User
          </button>
          <button
            className={`px-3 sm:px-4 py-2 font-semibold rounded-lg cursor-pointer ${
              userType === "hospital"
                ? "bg-[#fb4673] text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("hospital")}
          >
            Signup as Hospital
          </button>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Full Name (Only for User) */}
          {userType === "user" && (
            <div className="col-span-1 sm:col-span-2">
              <label className="flex items-center text-lg">
                <UserPlus className="mr-2 text-[#fb4673]" />
                Full Name
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
          )}

          {/* Hospital Name (Only for Hospital) */}
          {userType === "hospital" && (
            <div className="col-span-1 sm:col-span-2">
              <label className="flex items-center text-lg">
                <Hospital className="mr-2 text-[#fb4673]" />
                Hospital Name
              </label>
              <input
                type="text"
                {...register("hospitalName", {
                  required: userType === "hospital",
                })}
                className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                placeholder="Enter Hospital Name"
              />
              {errors.hospitalName && (
                <p className="text-red-500 text-sm">
                  {errors.hospitalName.message}
                </p>
              )}
            </div>
          )}

          {/* Registration Number (Only for Hospital) */}
          {userType === "hospital" && (
            <div className="col-span-1 sm:col-span-2">
              <label className="flex items-center text-lg">
                <Shield className="mr-2 text-[#fb4673]" />
                Registration Number
              </label>
              <input
                type="text"
                {...register("registrationNumber", {
                  required: userType === "hospital",
                })}
                className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                placeholder="Enter Registration Number"
              />
              {errors.registrationNumber && (
                <p className="text-red-500 text-sm">
                  {errors.registrationNumber.message}
                </p>
              )}
            </div>
          )}

          {/* Hospital Operating Hours (Only for Hospital) */}
          {userType === "hospital" && (
            <>
              <div className="col-span-1">
                <label className="flex items-center text-lg">
                  <Clock className="mr-2 text-[#fb4673]" />
                  Opening Time
                </label>
                <input
                  type="time"
                  {...register("operatingHours.open")}
                  className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                />
                {errors.operatingHours?.open && (
                  <p className="text-red-500 text-sm">{errors.operatingHours.open.message}</p>
                )}
              </div>
              <div className="col-span-1">
                <label className="flex items-center text-lg">
                  <Clock className="mr-2 text-[#fb4673]" />
                  Closing Time
                </label>
                <input
                  type="time"
                  {...register("operatingHours.close")}
                  className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                />
                {errors.operatingHours?.close && (
                  <p className="text-red-500 text-sm">{errors.operatingHours.close.message}</p>
                )}
              </div>
            </>
          )}

          {/* Emergency Contact (Only for Hospital) */}
          {userType === "hospital" && (
            <>
              <div className="col-span-1">
                <label className="flex items-center text-lg">
                  <User className="mr-2 text-[#fb4673]" />
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  {...register("emergencyContact.name")}
                  className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                  placeholder="Emergency contact person"
                />
                {errors.emergencyContact?.name && (
                  <p className="text-red-500 text-sm">{errors.emergencyContact.name.message}</p>
                )}
              </div>
              <div className="col-span-1">
                <label className="flex items-center text-lg">
                  <Phone className="mr-2 text-[#fb4673]" />
                  Emergency Contact Phone
                </label>
                <input
                  type="text"
                  {...register("emergencyContact.phone")}
                  className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                  placeholder="Emergency contact number"
                />
                {errors.emergencyContact?.phone && (
                  <p className="text-red-500 text-sm">{errors.emergencyContact.phone.message}</p>
                )}
              </div>
            </>
          )}

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

          {/* Phone Number */}
          <div>
            <label className="flex items-center text-lg">
              <Phone className="mr-2 text-[#fb4673]" />
              Phone Number
            </label>
            <input
              type="text"
              {...register("phone")}
              className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
              placeholder="9876543210"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
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

          {/* Confirm Password */}
          <div>
            <label className="flex items-center text-lg">
              <Lock className="mr-2 text-[#fb4673]" />
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* City */}
          <div className="col-span-1">
            <label className="flex items-center text-lg">
              <MapPin className="mr-2 text-[#fb4673]" />
              City
            </label>
            <input
              type="text"
              {...register("location.city")}
              className={`w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none ${
                userType === 'user' ? 'cursor-not-allowed' : ''
              }`}
              placeholder={userType === 'user' ? "Detecting location..." : "Enter City"}
              readOnly={userType === 'user'}
            />
            {errors.location?.city && (
              <p className="text-red-500 text-sm">{errors.location.city.message}</p>
            )}
          </div>

          {/* State */}
          <div className="col-span-1">
            <label className="flex items-center text-lg">
              <MapPin className="mr-2 text-[#fb4673]" />
              State
            </label>
            <input
              type="text"
              {...register("location.state")}
              className={`w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none ${
                userType === 'user' ? 'cursor-not-allowed' : ''
              }`}
              placeholder={userType === 'user' ? "Detecting location..." : "Enter State"}
              readOnly={userType === 'user'}
            />
            {errors.location?.state && (
              <p className="text-red-500 text-sm">{errors.location.state.message}</p>
            )}
          </div>

          {/* Blood Group - Only for User */}
          {userType === "user" && (
            <div>
              <label className="flex items-center text-lg">
                <Heart className="mr-2 text-[#fb4673]" />
                Blood Group
              </label>
              <input
                type="text"
                {...register("bloodGroup", { required: userType === "user" })}
                className="w-full p-2 mt-1 rounded-lg bg-[#1b3a4b] text-white focus:outline-none"
                placeholder="A+, B-, O+, etc."
              />
              {errors.bloodGroup && (
                <p className="text-red-500 text-sm">
                  {errors.bloodGroup.message}
                </p>
              )}
            </div>
          )}

          <div className="col-span-1 sm:col-span-2 bg-[#fb4673] hover:bg-[#28bca9] py-3 rounded-lg text-lg font-semibold transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center">
            <button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-[#28bca9] underline">
              Login
            </Link>
          </p>
        </form>
      </motion.div>
    </section>
  );
};

export default Signup;
