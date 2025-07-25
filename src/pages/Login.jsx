import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { LuEye, LuEyeOff } from "react-icons/lu";
import useAuthStore from "@/authStore";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { isAuth, isAdmin, memberId, login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      if (isAdmin) {
        navigate("/members");
      } else {
        navigate(`/memberView`);
      }
    }
  }, [isAuth, isAdmin, memberId, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      const { isAdmin } = useAuthStore.getState();

      if (isAdmin) {
        navigate("/members");
      } else {
        navigate(`/memberView`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center my-10">
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center items-center gap-10 font-poppins w-full lg:gap-6"
      >
        <div className="size-36 rounded-full bg-gray-300"></div>
        <p className="text-3xl font-semibold lg:text-2xl">Welcome Back!</p>

        <div className="flex flex-col gap-3 w-[65%] md:items-center">
          <label htmlFor="username" className="ml-3 md:w-3/5 lg:w-1/2 xl:w-2/5">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="border border-black p-3 rounded-md md:w-3/5 lg:w-1/2 xl:w-2/5"
            placeholder="Enter your Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label htmlFor="password" className="ml-3 md:w-3/5 lg:w-1/2 xl:w-2/5">
            Password
          </label>
          <div className="w-full flex flex-col items-center relative">
            <div className="relative w-full md:w-3/5 lg:w-1/2 xl:w-2/5">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="w-full border border-black p-3 pr-10 rounded-md"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                type="button"
              >
                {showPassword ? (
                  <LuEyeOff className="size-5" />
                ) : (
                  <LuEye className="size-5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-right md:w-3/5 lg:w-1/2 xl:w-2/5">
            Forgot Password?
          </p>
        </div>

        <div className="w-[65%] flex justify-center">
          <Button
            type="submit"
            className="bg-blue-button font-light text-md px-10 py-7 w-full md:w-3/5 lg:w-1/2 xl:w-2/5"
          >
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
