import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { BsEyeSlash } from "react-icons/bs";
import { BsEye } from "react-icons/bs";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

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
          <Button className="font-normal text-md px-5 py-6 bg-blue-button md:px-10 hover:cursor-pointer">
            Save New Password
          </Button>
        </div>
      </div>
    </div>
  );
}
