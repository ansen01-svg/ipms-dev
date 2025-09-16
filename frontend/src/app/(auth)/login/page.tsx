"use client";

import gratiaLogo from "@/assets/images/gratia-logo.png";
import panelImage from "@/assets/images/login-panel-img.jpg";
import logo from "@/assets/images/logo4.png";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
// import { useAuth } from "@/contexts/auth-context";
// import { setAuthToken, setUserData } from "@/lib/rbac-config.ts/auth-local";
import { LoginFormData, loginSchema } from "@/schema/auth/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const { login } = useAuth();

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

  // const onSubmit = async (loginData: LoginFormData) => {
  //   try {
  //     const response = await fetch(
  //       // `${process.env.NEXT_PUBLIC_PROD_API_URL}/login`,
  //       `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(loginData),
  //         credentials: "include",
  //       }
  //     );

  //     // Parse response data first
  //     const data = await response.json();
  //     console.log(data);

  //     if (!response.ok) {
  //       // Handle HTTP error responses
  //       throw new Error(data.error || data.message || "Login failed");
  //     }

  //     console.log("Login successful:", data);

  //     // Reset form on successful login
  //     reset();

  //     // Redirect to role-specific dashboard
  //     const dashboardPath =
  //       ROLE_DASHBOARD_PATHS[
  //         data.user.role as keyof typeof ROLE_DASHBOARD_PATHS
  //       ];

  //     if (dashboardPath) {
  //       console.log("Redirecting to:", dashboardPath);
  //       window.location.replace(dashboardPath);
  //     } else {
  //       throw new Error("Invalid user role or dashboard path not found");
  //     }
  //   } catch (error) {
  //     // Proper error handling for fetch API
  //     if (error instanceof Error) {
  //       toast.error(error.message);
  //     } else if (error instanceof TypeError) {
  //       // Network errors or fetch failures
  //       toast.error("Network error. Please check your connection.");
  //     } else {
  //       toast.error("Something went wrong. Please try again.");
  //     }

  //     console.error("Login error:", error);
  //   }
  // };

  // const onSubmit = async (loginData: LoginFormData) => {
  //   try {
  //     const response = await fetch(
  //       // `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/login`,
  //       `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(loginData),
  //         credentials: "include",
  //       }
  //     );

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error || data.message || "Login failed");
  //     }

  //     console.log("Login: API success", {
  //       hasUser: !!data.user,
  //       hasToken: !!(data.token || data.accessToken),
  //       userRole: data.user?.role,
  //     });

  //     const token = data.token || data.accessToken;
  //     if (!token) {
  //       throw new Error("No token received from server");
  //     }

  //     // Store with error handling
  //     try {
  //       // Store in localStorage first
  //       setAuthToken(token);
  //       setUserData(data.user);

  //       // Verify storage before proceeding
  //       const storedToken = localStorage.getItem("auth-token");
  //       const storedData = localStorage.getItem("user-data");

  //       if (!storedToken || !storedData) {
  //         throw new Error(
  //           "Failed to store authentication data in localStorage"
  //         );
  //       }

  //       console.log("Login: Storage verification passed");

  //       // Update auth context
  //       login(data.user, token);

  //       // Small delay to ensure all operations complete
  //       await new Promise((resolve) => setTimeout(resolve, 100));
  //     } catch (storageError) {
  //       console.error("Login: Storage failed:", storageError);
  //       toast.error("Failed to save authentication data. Please try again.");
  //       return;
  //     }

  //     // Reset form
  //     reset();

  //     // Determine redirect path
  //     const dashboardPath =
  //       ROLE_DASHBOARD_PATHS[
  //         data.user.role as keyof typeof ROLE_DASHBOARD_PATHS
  //       ];

  //     if (!dashboardPath) {
  //       throw new Error("Invalid user role or dashboard path not found");
  //     }

  //     window.location.href = dashboardPath;
  //   } catch (error) {
  //     console.error("Login: Error:", error);

  //     // Clear any partially stored data on error
  //     if (typeof window !== "undefined") {
  //       localStorage.removeItem("auth-token");
  //       localStorage.removeItem("user-data");
  //     }

  //     if (error instanceof Error) {
  //       toast.error(error.message);
  //     } else if (error instanceof TypeError) {
  //       toast.error("Network error. Please check your connection.");
  //     } else {
  //       toast.error("Something went wrong. Please try again.");
  //     }
  //   }
  // };

  const onSubmit = async (loginData: LoginFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/login`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginData),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Login failed");
      }

      console.log("Login: API success", {
        hasEmail: !!data.email,
      });

      // Reset form
      reset();

      // Determine redirect path
      const redirectPath = `/verify-otp?email=${encodeURIComponent(
        data.email
      )}`;

      window.location.href = redirectPath;
    } catch (error) {
      console.error("Login: Error:", error);

      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof TypeError) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gray-50">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Panel - Hidden on mobile */}
        <div className="hidden lg:flex relative bg-teal-600 text-white overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={panelImage}
              alt="Background"
              fill
              className="object-cover opacity-20"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col p-12 w-full">
            {/* Logo Section */}
            <div className="mb-8">
              <Link href={"/"} className="flex-shrink-0">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                  <Image
                    src={logo}
                    width={40}
                    height={40}
                    alt="Logo"
                    className="rounded"
                  />
                  <span className="text-sm font-semibold tracking-wider">
                    iPMS
                  </span>
                </div>
              </Link>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center max-w-lg">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Welcome to
                <br />
                <span className="text-white/90">iPMS</span>
              </h1>

              <p className="text-lg text-white/80 leading-relaxed mb-8">
                The Integrated Project Monitoring System is designed for
                comprehensive project tracking, data analytics, progress
                monitoring, and strategic planning across all organizational
                levels.
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-white/70 mb-2">
                Designed, Developed & Maintained by
              </p>
              <div className="flex items-center gap-2">
                <Image
                  src={gratiaLogo}
                  width={50}
                  height={50}
                  alt="Gratia Technology Logo"
                  className="rounded"
                />
                <div className="flex flex-col items-start justify-center text-white">
                  <span className="text-xs font-semibold">
                    GRATIA TECHNOLOGY
                  </span>
                  <span className="text-[10px] gap-2">DEFINING DIGITALLY</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="flex flex-col justify-center items-center p-6 lg:p-16 bg-white w-full min-h-screen">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Header - Only shown on small screens */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src={logo}
                    alt="iPMS Logo"
                    width={60}
                    height={60}
                    className="rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-teal-600 text-wrap">
                    Integrated Project Monitoring System
                  </h1>
                </div>
              </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center">
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <Link href="/" className="flex-shrink-0">
                  <Image
                    src={logo}
                    alt="iPMS Logo"
                    width={50}
                    height={50}
                    className="rounded-lg hover:opacity-80 transition-opacity"
                  />
                </Link>
                <h1 className="text-xl font-bold text-teal-600">
                  INTEGRATED PROJECT MONITORING SYSTEM
                </h1>
              </div>
            </div>

            {/* Login Form Container */}
            <div className="p-8">
              <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">
                Login
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
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </div>

            {/* Footer - Only shown on mobile */}
            <div className="lg:hidden text-center text-xs text-gray-500 mt-8">
              <p>Designed, Developed & Maintained by</p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <Image
                  src={gratiaLogo}
                  width={40}
                  height={40}
                  alt="Gratia Technology Logo"
                  className="rounded"
                />
                <div className="flex flex-col items-start justify-center">
                  <span className="text-xs font-semibold">
                    GRATIA TECHNOLOGY
                  </span>
                  <span className="text-[10px] gap-2">DEFINING DIGITALLY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
