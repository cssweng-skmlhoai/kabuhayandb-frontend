import React, { useState } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setError("");

    alert("Password successfully reset!");
  };

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <div className="flex flex-col space-y-4 border">
        <div className="flex flex-col space-y-3">
          <h2 className="text-center text-2xl font-semibold mb-1">
            Reset Password
          </h2>
          <p className="text-center text-xl text-gray-600 mb-6">
            Enter your new password below
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <p>New Password</p>
          <input
            input
            value={password}
            placeholder="Enter your new password"
            className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <p>New Password</p>
          <input
            input
            value={password}
            placeholder="Confirm new password"
            className="w-full border rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
}
