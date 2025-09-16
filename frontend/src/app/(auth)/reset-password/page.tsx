"use client";

import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schema/auth/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("resetToken");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const toggleVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  console.log("Reset Token:", resetToken); // Debugging line

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      if (!resetToken) {
        toast.error("Invalid or missing reset token");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/reset-password/${resetToken}`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/reset-password/${resetToken}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword: data.newPassword,
          }),
        }
      );

      // Check if the response is successful
      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = "Change failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // If successful, parse the response (optional, depending on your API)
      await response.json();

      toast.success("Password changed successfully");
      router.push("/login");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const renderInput = (
    name: keyof ResetPasswordSchema,
    placeholder: string
  ) => (
    <div className="w-full">
      <div className="flex items-center w-full h-10 rounded-md overflow-hidden border border-[#C5C5C5] bg-white transition outline-none focus:outline-none relative">
        <span className="w-10 h-full bg-teal-600 text-white flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4" />
        </span>
        <input
          type={showPassword[name] ? "password" : "text"}
          placeholder={placeholder}
          {...register(name)}
          className="w-full h-full px-3 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:outline-none bg-transparent pr-10"
        />
        <button
          type="button"
          onClick={() => toggleVisibility(name)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
        >
          {showPassword[name] ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="h-5 flex items-start">
        {errors[name] && (
          <p className="text-red-500 text-xs px-2 mt-1">
            {errors[name]?.message}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-6 overflow-y-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-5 border border-gray-200 my-auto"
      >
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">
          Reset Password
        </h2>

        <div className="space-y-4">
          {renderInput("newPassword", "New Password")}
          {renderInput("confirmPassword", "Confirm New Password")}
        </div>

        <div className="pt-2">
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
