"use client";

import logo from "@/assets/images/logo4.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { setAuthToken, setUserData } from "@/lib/rbac-config/auth-local";
import { ROLE_DASHBOARD_PATHS } from "@/lib/rbac-config/constants";
import {
  VerifyOtpSchema,
  verifyOtpSchema,
} from "@/schema/auth/verifyOtpSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, LoaderCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_PROD_API_URL;
// const API_URL = process.env.NEXT_PUBLIC_DEV_API_URL;

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
  const [loading, setLoading] = useState(false); // Fixed: Now properly managed
  const [resending, setResending] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

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

    // Reset verification status when user starts typing
    if (verificationStatus !== "idle") {
      setVerificationStatus("idle");
    }

    const currentOtp = getValues("otp").split("");
    currentOtp[index] = value;
    const newOtp = currentOtp.join("");
    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.length === 6 && !loading) {
      handleSubmit(onSubmit)();
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
    setLoading(true);
    setVerificationStatus("idle");

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...otpData, email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        setVerificationStatus("error");

        // Handle specific error cases
        if (response.status === 400) {
          toast.error(data.message || "Invalid OTP. Please try again.");
        } else if (response.status === 429) {
          toast.error("Too many attempts. Please wait before trying again.");
        } else if (response.status === 410) {
          toast.error("OTP has expired. Please request a new one.");
        } else {
          toast.error(data.error || data.message || "OTP verification failed");
        }

        // Clear the OTP input on error
        setValue("otp", "");
        inputRefs.current[0]?.focus();
        return;
      }

      const token = data.token || data.accessToken;
      if (!token) {
        setVerificationStatus("error");
        toast.error("No token received from server");
        return;
      }

      // Set success status first
      setVerificationStatus("success");
      toast.success("OTP verified successfully! Redirecting...");

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

        // Update auth context
        login(data.user, token);

        // Small delay to ensure all operations complete and show success state
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (storageError) {
        console.error("Login: Storage failed:", storageError);
        setVerificationStatus("error");
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
        setVerificationStatus("error");
        toast.error("Invalid user role or dashboard path not found");
        return;
      }

      window.location.replace(dashboardPath);
    } catch (error) {
      console.error("Login: Error:", error);
      setVerificationStatus("error");

      // Clear any partially stored data on error
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-token");
        localStorage.removeItem("user-data");
      }

      if (error instanceof Error) {
        if (error.name === "TypeError") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      // Clear OTP and focus first input on error
      setValue("otp", "");
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setVerificationStatus("idle");

    try {
      const response = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      toast.success("OTP resent successfully");
      setValue("otp", "");
      inputRefs.current[0]?.focus();
      setResendTimer(60);
    } catch (error) {
      console.error("Resend OTP error:", error);

      if (error instanceof Error) {
        if (error.name === "TypeError") {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to resend OTP. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  const getInputClassName = (index: number) => {
    const baseClass =
      "w-10 h-10 sm:w-12 sm:h-12 text-center border rounded-md text-lg focus:outline-none transition-all";
    const currentOtp = getValues("otp");
    const hasValue = currentOtp[index];

    if (verificationStatus === "success") {
      return `${baseClass} border-green-500 bg-green-50 text-green-700`;
    } else if (verificationStatus === "error") {
      return `${baseClass} border-red-500 bg-red-50 text-red-700`;
    } else if (hasValue) {
      return `${baseClass} border-[#279eab] bg-blue-50 focus:ring-2 focus:ring-[#279eab] focus:border-transparent`;
    } else {
      return `${baseClass} border-gray-300 focus:ring-2 focus:ring-[#C5C5C5] focus:border-transparent`;
    }
  };

  const getButtonContent = () => {
    if (verificationStatus === "success") {
      return (
        <>
          <CheckCircle className="w-4 h-4 mr-2" />
          Verified! Redirecting...
        </>
      );
    } else if (loading) {
      return (
        <>
          <LoaderCircle className="w-4 h-4 mr-2 animate-spin [animation-duration:0.5s]" />
          Verifying OTP...
        </>
      );
    } else {
      return "Verify OTP";
    }
  };

  const getButtonClassName = () => {
    const baseClass =
      "w-full py-3 text-sm font-medium rounded-md transition-all hover:shadow-lg disabled:cursor-not-allowed";

    if (verificationStatus === "success") {
      return `${baseClass} bg-green-600 text-white hover:bg-green-700`;
    } else if (verificationStatus === "error") {
      return `${baseClass} bg-red-600 text-white hover:bg-red-700`;
    } else {
      return `${baseClass} bg-[#279eab] text-white hover:bg-[#1c8193] disabled:opacity-50`;
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

        {/* Status Message */}
        {verificationStatus === "success" && (
          <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>OTP verified successfully!</span>
          </div>
        )}

        {verificationStatus === "error" && (
          <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
            <XCircle className="w-4 h-4" />
            <span>Please check your OTP and try again</span>
          </div>
        )}

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
                    disabled={loading}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    className={getInputClassName(index)}
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
              disabled={resending || loading}
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
            disabled={loading || verificationStatus === "success"}
            className={getButtonClassName()}
          >
            {getButtonContent()}
          </Button>
        </div>
      </form>
    </div>
  );
}
