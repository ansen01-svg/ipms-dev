"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/schemas/auth/loginSchema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { User, Lock, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userId: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("User ID:", data);

    try {
      await axios.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("Login successful!");
      reset();
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.error || "Login failed.";
        toast.error(msg);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen font-sans text-sm">
        {/* Left Panel */}
        <div className="relative bg-[#279eab] text-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-6 lg:py-10 xl:px-8 xl:py-12 flex flex-col justify-center items-center overflow-hidden min-h-[300px] lg:min-h-screen">
          <div className="mb-4 sm:mb-6">
            <Image
              src="/assets/images/logo4.png"
              width={50}
              height={50}
              alt="Logo"
              className="rounded-sm sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px]"
            />
          </div>
          <div className="relative z-10 text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-sm xl:max-w-md">
            <h1 className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-base font-bold uppercase tracking-wide leading-tight">
              INTEGRATED PROJECT MONITORING SYSTEM
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-extrabold mt-2 sm:mt-3 md:mt-4">
              iPMS
            </h2>
            <p className="text-xs sm:text-sm tracking-wide uppercase mt-1 sm:mt-2">
              Monitoring and Data Analytic System
            </p>
            <p className="text-[10px] sm:text-[11px] mt-4 sm:mt-5 md:mt-6">
              Designed, Developed & Maintained by
            </p>
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold">
              <span>GRATIA TECHNOLOGY</span>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex flex-col justify-center items-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-16 bg-white w-full min-h-screen overflow-y-auto">
          <div className="w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] space-y-4 sm:space-y-5 md:space-y-6 bg-white p-3 sm:p-4 md:p-6 lg:p-8 rounded-md shadow-lg mb-auto">
            <div className="text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Image
                  src="/assets/images/logo4.png"
                  alt="Council Logo"
                  width={60}
                  height={45}
                  className="rounded sm:w-[70px] sm:h-[52px] md:w-[80px] md:h-[60px] flex-shrink-0"
                />
                <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-[#1266ab] text-center leading-tight">
                  INTEGRATED PROJECT MONITORING SYSTEM
                </h1>
              </div>
            </div>

            {/* Login Form Container */}
            <div className="border border-gray-300 p-3 sm:p-4 md:p-5 lg:p-6 rounded-md shadow-sm w-full">
              <h2 className="text-center text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-5">
                USER LOGIN
              </h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-3 sm:space-y-4 w-full"
              >
                {/* User ID Field */}
                <div className="w-full">
                  <label className="block text-[11px] sm:text-[12px] font-semibold mb-1">
                    User ID
                  </label>
                  <div className="flex items-center w-full min-w-0">
                    <span className="flex items-center justify-center w-8 h-9 sm:w-9 sm:h-9 md:w-10 md:h-9 bg-[#279eab] rounded-l-sm shrink-0">
                      <User className="w-3 h-4 sm:w-4 sm:h-4 text-white" />
                    </span>
                    <input
                      type="text"
                      placeholder="Enter User ID"
                      {...register("userId")}
                      className={`w-full h-9 sm:h-9 px-2 sm:px-3 border-t border-b border-r text-[12px] sm:text-[13px] text-black placeholder:text-gray-500 focus:outline-none  rounded-r-sm transition-colors ${
                        errors.userId ? "border-red-500" : "border-[#C5C5C5]"
                      }`}
                    />
                  </div>
                  <div className="h-5 sm:h-5 flex items-start">
                    {errors.userId && (
                      <p className="text-red-600 text-[10px] sm:text-xs mt-1 pl-1 sm:pl-2">
                        {errors.userId.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password Field with Toggle */}
                <div className="w-full">
                  <label className="block text-[11px] sm:text-[12px] md:text-[13px] font-semibold mb-1">
                    Password
                  </label>
                  <div className="flex items-center w-full min-w-0 relative">
                    <span className="flex items-center justify-center w-8 h-9 sm:w-9 sm:h-9 md:w-10 md:h-9 bg-[#279eab] rounded-l-sm shrink-0">
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      {...register("password")}
                      className={`w-full h-9 sm:h-9 px-2 sm:px-3 pr-8 border-t border-b border-r text-[12px] sm:text-[13px] text-black placeholder:text-gray-500 focus:outline-none rounded-r-sm transition-colors ${
                        errors.password ? "border-red-500" : "border-[#C5C5C5]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-2.5 text-gray-500 hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="h-4 sm:h-5 flex items-start justify-between">
                    <div className="flex-1">
                      {errors.password && (
                        <p className="text-red-600 text-[10px] sm:text-xs mt-1 pl-1 sm:pl-2">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] sm:text-[12px] md:text-[13px] text-blue-600 hover:underline mt-1 ml-2 flex-shrink-0 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center space-x-2 pt-1 sm:pt-2">
                  <Checkbox
                    id="remember"
                    checked={undefined}
                    onCheckedChange={(val) => setValue("rememberMe", !!val)}
                    className="w-2 h-2 sm:w-4 sm:h-4"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[12px] sm:text-sm text-gray-700 font-medium cursor-pointer select-none"
                  >
                    Remember Me
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-2 sm:pt-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center gap-2 border border-[#C5C5C5] text-[12px] sm:text-sm font-medium py-3 sm:py-4 rounded transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      isSubmitting
                        ? "bg-[#279eab] text-white cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-[#279eab] hover:text-white hover:shadow-lg"
                    }`}
                  >
                    {isSubmitting && (
                      <LoaderCircle className="w-3 h-3 sm:w-4 sm:h-4 animate-spin [animation-duration:0.5s]" />
                    )}
                    {isSubmitting ? "Signing in..." : "SIGN IN"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        richColors
        toastOptions={{
          style: { fontSize: "14px" },
          className: "text-sm sm:text-base",
        }}
      />
    </div>
  );
};

export default LoginPage;
