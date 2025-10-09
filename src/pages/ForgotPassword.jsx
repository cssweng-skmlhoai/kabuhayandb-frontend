import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "@/assets/SKMLHOAI_Logo.jpg";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Placeholder logic – replace with your API call if needed
      // await api.post("/auth/forgot-password", { email });
      toast.success("Password reset instructions sent to your email!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center my-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-10 font-poppins w-full lg:gap-6"
      >
        <img src={Logo} alt="SKMLHOAI" className="size-36" />
        <p className="text-3xl font-semibold lg:text-2xl">
          Forgot Your Password?
        </p>
        <p className="text-gray-600 text-center text-sm w-[70%] md:w-3/5 lg:w-1/2 xl:w-2/5">
          Enter your email address below and we’ll send you instructions to reset your password.
        </p>

        <div className="flex flex-col gap-3 w-[65%] md:items-center">
          <label htmlFor="email" className="ml-3 md:w-3/5 lg:w-1/2 xl:w-2/5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="border border-black p-3 rounded-md md:w-3/5 lg:w-1/2 xl:w-2/5"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-[65%] flex flex-col items-center mt-5 gap-3">
          <Button
            type="submit"
            className="bg-blue-button font-light text-md px-10 py-7 w-full md:w-3/5 lg:w-1/2 xl:w-2/5"
          >
            Send Reset Link
          </Button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline text-sm mt-2"
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
