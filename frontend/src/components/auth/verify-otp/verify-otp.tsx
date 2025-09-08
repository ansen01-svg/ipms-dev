"use client";

import logo from "@/assets/images/logo4.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { setAuthToken, setUserData } from "@/lib/rbac-config.ts/auth-local";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config.ts/constants";
import {
  VerifyOtpSchema,
  verifyOtpSchema,
} from "@/schema/auth/verifyOtpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

export default function VerifyOTPForm() {
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "test@example.com";

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<VerifyOtpSchema>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [loading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const currentOtp = getValues("otp").split("");
    currentOtp[index] = value;
    const newOtp = currentOtp.join("");
    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    const currentOtp = getValues("otp").split("");
    if (e.key === "Backspace" && currentOtp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (otpData: VerifyOtpSchema) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/verifyotp`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/verifyotp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...otpData, email }),
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "OTP verification failed"
        );
      }

      console.log("OTP verification: API success", {
        hasUser: !!data.user,
        hasToken: !!(data.token || data.accessToken),
        userRole: data.user?.role,
      });

      const token = data.token || data.accessToken;
      if (!token) {
        throw new Error("No token received from server");
      }

      // Store with error handling
      try {
        // Store in localStorage first
        setAuthToken(token);
        setUserData(data.user);

        // Verify storage before proceeding
        const storedToken = localStorage.getItem("auth-token");
        const storedData = localStorage.getItem("user-data");

        if (!storedToken || !storedData) {
          throw new Error(
            "Failed to store authentication data in localStorage"
          );
        }

        console.log("Login: Storage verification passed");

        // Update auth context
        login(data.user, token);

        // Small delay to ensure all operations complete
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (storageError) {
        console.error("Login: Storage failed:", storageError);
        toast.error("Failed to save authentication data. Please try again.");
        return;
      }

      // Reset form
      reset();

      // Determine redirect path
      const dashboardPath =
        ROLE_DASHBOARD_PATHS[
          data.user.role as keyof typeof ROLE_DASHBOARD_PATHS
        ];

      if (!dashboardPath) {
        throw new Error("Invalid user role or dashboard path not found");
      }

      window.location.href = dashboardPath;
    } catch (error) {
      console.error("Login: Error:", error);

      // Clear any partially stored data on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-data");
      }

      if (error instanceof Error) {
        toast.error(error.message);
      } else if (error instanceof TypeError) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  // const onSubmit = async (data: VerifyOtpSchema) => {
  //   setLoading(true);
  //   try {
  //     await axios.post("/api/auth/verify-otp", { email, otp: data.otp });
  //     toast.success("OTP verified successfully");
  //     router.push(`/reset-password?email=${encodeURIComponent(email)}`);
  //   } catch (error) {
  //     const err = error as AxiosError<{ message?: string }>;
  //     toast.error(err.response?.data?.message || "OTP verification failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleResend = async () => {
    setResending(true);
    try {
      await axios.post("/api/auth/resend-otp", { email });
      toast.success("OTP resent successfully");
      setValue("otp", "");
      inputRefs.current[0]?.focus();
      setResendTimer(60);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 space-y-5 border border-gray-200 my-auto"
      >
        {/* Logo Section */}
        <div className="flex justify-center">
          <Image
            src={logo}
            width={60}
            height={60}
            alt="Logo"
            className="h-12 w-auto"
          />
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
          OTP Verification
        </h2>

        {/* Email Display */}
        <p className="text-center text-sm text-gray-600 leading-relaxed">
          An OTP has been sent to <br />
          <span className="font-medium break-all">{email}</span>
        </p>

        {/* OTP Input Section */}
        <div className="space-y-3">
          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <div className="flex justify-between gap-2 sm:gap-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={field.value[index] || ""}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-[#C5C5C5] focus:border-transparent transition-all"
                  />
                ))}
              </div>
            )}
          />

          {/* Fixed height container for error message */}
          <div className="h-5 flex items-start justify-center">
            {errors.otp && (
              <p className="text-red-500 text-sm text-center">
                {errors.otp.message}
              </p>
            )}
          </div>
        </div>

        {/* Resend Timer/Button Section */}
        <div className="text-center text-sm text-gray-600 min-h-[20px] flex items-center justify-center">
          {resendTimer > 0 ? (
            <span>
              Resend OTP in{" "}
              <span className="font-medium text-gray-700">
                00:{resendTimer.toString().padStart(2, "0")}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="text-gray-700 underline inline-flex items-center gap-1 hover:text-[#a03454] transition-colors disabled:opacity-50"
            >
              {resending && (
                <LoaderCircle className="w-4 h-4 animate-spin [animation-duration:0.5s]" />
              )}
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-medium rounded-md bg-[#279eab] text-white hover:bg-[#1c8193] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-4 h-4 mr-2 animate-spin [animation-duration:0.5s]" />
                Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
