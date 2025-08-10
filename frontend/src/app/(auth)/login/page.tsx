"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Toaster } from "@/components/ui/sonner";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
import { setCookie } from "@/lib/rbac-config.ts/sett-cookie";
import { LoginFormData, loginSchema } from "@/schema/auth/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import logo from "@/assets/images/logo4.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginPage = () => {
  // const router = useRouter();
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

  const onSubmit = async (loginData: LoginFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
        }
      );

      // Parse response data first
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        // Handle HTTP error responses
        throw new Error(data.error || data.message || "Login failed");
      }

      // Reset form on successful login
      reset();

      // Set authentication cookie with better security
      const maxAge = 24 * 60 * 60; // 24 hours in seconds
      const cookieValue = `auth-token=${data.token}; path=/; max-age=${maxAge}; secure; samesite=strict; httponly`;
      document.cookie = cookieValue;

      // Alternative: Use a more secure cookie setting function
      setCookie("auth-token", data.token, {
        maxAge: maxAge,
        secure: true,
        sameSite: "strict",
        httpOnly: true,
      });

      // Redirect to role-specific dashboard
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[
          data.user.role as keyof typeof ROLE_DASHBOARD_PATHS
        ];

      if (dashboardPath) {
        window.location.replace(dashboardPath);
      } else {
        throw new Error("Invalid user role or dashboard path not found");
      }
    } catch (error) {
      // Proper error handling for fetch API
      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof TypeError) {
        // Network errors or fetch failures
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Hidden on mobile */}
        <div className="hidden lg:flex relative bg-teal-600 text-white px-8 py-12 flex-col justify-center items-center overflow-hidden">
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-8">
              <Image
                src={logo}
                width={80}
                height={80}
                alt="Logo"
                className="rounded-lg mx-auto"
              />
            </div>

            <h1 className="text-lg font-bold uppercase tracking-wide leading-tight mb-4">
              INTEGRATED PROJECT MONITORING SYSTEM
            </h1>
            <h2 className="text-5xl font-extrabold mb-3">iPMS</h2>
            <p className="text-base tracking-wide uppercase mb-8 opacity-90">
              Monitoring and Data Analytic System
            </p>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm mb-2 opacity-75">
                Designed, Developed & Maintained by
              </p>
              <div className="text-lg font-semibold">GRATIA TECHNOLOGY</div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex flex-col justify-center items-center p-6 lg:p-16 bg-white w-full min-h-screen">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header - Only shown on small screens */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Image
                  src={logo}
                  alt="iPMS Logo"
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <div>
                  <h1 className="text-2xl font-bold text-teal-600">iPMS</h1>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Project Monitoring System
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Image
                  src={logo}
                  alt="iPMS Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                />
                <h1 className="text-xl font-bold text-teal-600">
                  INTEGRATED PROJECT MONITORING SYSTEM
                </h1>
              </div>
            </div>

            {/* Login Form Container */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
              <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
                USER LOGIN
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* User ID Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <span className="flex items-center justify-center w-12 h-full bg-teal-600 rounded-l-md">
                        <User className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter User ID"
                      {...register("userId")}
                      className={`w-full h-10 pl-14 pr-4 border text-sm text-gray-900 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all ${
                        errors.userId
                          ? "border-red-300 ring-red-100"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.userId && (
                    <p className="text-red-600 text-sm mt-2">
                      {errors.userId.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <span className="flex items-center justify-center w-12 h-full bg-teal-600 rounded-l-md">
                        <Lock className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      {...register("password")}
                      className={`w-full h-10 pl-14 pr-12 border text-sm text-gray-900 placeholder:text-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition-all ${
                        errors.password
                          ? "border-red-300 ring-red-100"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div>
                      {errors.password && (
                        <p className="text-red-600 text-sm">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-[#279eab] hover:text-[#1e7a85] font-medium transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <Checkbox
                    id="remember"
                    onCheckedChange={(val) => setValue("rememberMe", !!val)}
                    className="w-4 h-4 text-teal-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-3 text-sm text-gray-700 font-medium cursor-pointer"
                  >
                    Remember Me
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full h-10 flex justify-center items-center gap-2 text-sm font-medium rounded-md transition-all duration-200 ${
                    isSubmitting
                      ? "bg-teal-400 text-white cursor-not-allowed opacity-80"
                      : "bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "SIGN IN"
                  )}
                </Button>
              </form>
            </div>

            {/* Footer - Only shown on mobile */}
            <div className="lg:hidden text-center text-xs text-gray-500 mt-8">
              <p>Designed, Developed & Maintained by</p>
              <p className="font-semibold text-gray-700 mt-1">
                GRATIA TECHNOLOGY
              </p>
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
          className: "text-sm",
        }}
      />
    </div>
  );
};

export default LoginPage;
