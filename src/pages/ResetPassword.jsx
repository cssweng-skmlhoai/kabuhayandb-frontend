import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BsEyeSlash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const API_SECRET = import.meta.env.VITE_API_SECRET;

  const token = new URLSearchParams(window.location.search).get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing token");
      navigate("/login");
      return;
    }

    const verifyToken = async () => {
      try {
        await axios.get(
          `${API_URL}/credentials/reset/verify?token=${token}`,
          { headers: { Authorization: `Bearer ${API_SECRET}` } }
        );

        setLoading(false);
      } catch (error) {
        toast.error("Invalid link or expired token");
        navigate("/login");
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword){
      toast.error("Please enter a new password and confirm it");
      return;
    }

    if (password !== confirmPassword){
      toast.error("New Password and Confirm Password Do Not Match");
      return;
    }

    if (!token){
      toast.error("Invalid or missing token");
      return;
    }

    try {
      await axios.post(`${API_URL}/credentials/reset/confirm`, {
        token, new_password: password},
        { headers: { Authorization: `Bearer ${API_SECRET}` } }
      );

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-white">
      <button
        onClick={() => window.history.back()}
        className="absolute top-8 left-10 text-lg flex items-center gap-2 text-gray-700 hover:underline hover:cursor-pointer"
      >
        ← Back
      </button>

      <div className="flex flex-col space-y-15">
        <div className="flex flex-col mb-20">
          <h2 className="text-center text-2xl font-semibold mb-1">
            Reset Password
          </h2>
          <p className="text-center text-xl text-gray-600 mb-6">
            Enter your new password below
          </p>
        </div>

        <div className="flex flex-col space-y-3">
          <div className="relative w-[35rem]">
            <p>
              New Password <span className="text-red-400">*</span>
            </p>
            <div className="relative w-[35rem]">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                className="border border-gray-300 rounded-md px-3 pr-10 w-full bg-gray-200 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
              </span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <p>
              Confirm Password <span className="text-red-400">*</span>
            </p>
            <div className="relative w-[35rem]">
              <input
                type={showConfirmedPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your new password"
                className="border border-gray-300 rounded-md px-3 pr-10 w-full bg-gray-200 py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              />
              <span
                onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                {showConfirmedPassword ? (
                  <BsEye size={20} />
                ) : (
                  <BsEyeSlash size={20} />
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex item-center justify-center">
          <Button type="submit" onClick={handleSubmit} className="font-normal text-md px-5 py-6 bg-blue-button md:px-10 hover:cursor-pointer">
            Save New Password
          </Button>
        </div>
      </div>
    </div>
  );
}
