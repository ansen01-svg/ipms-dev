"use client";

import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/schema/auth/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_PROD_API_URL}/auth/forgot-password`,
        // `${process.env.NEXT_PUBLIC_DEV_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email }),
        }
      );

      if (!response.ok) {
        // Try to parse error message from response
        let errorMessage = "Failed to send OTP";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text or default message
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      reset();
      toast.success("OTP sent to your email. Please check your inbox.");
    } catch (error: unknown) {
      let message = "Failed to send OTP";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-5"
      >
        <h2 className="text-xl font-bold text-gray-700 text-center">
          Forgot Password
        </h2>

        <div>
          <label className="text-sm font-medium mb-1 block">Email</label>
          <div className="flex items-center w-full min-w-0">
            <span className="w-10 h-10 bg-teal-600 text-white flex items-center justify-center rounded-l-sm">
              <Mail className="w-4 h-4" />
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className="w-full h-10 px-3 border-t border-b border-r border-[#C5C5C5] text-sm text-black placeholder:text-gray-500 focus:outline-none rounded-r-sm"
            />
          </div>
          {/* Fixed height container for error message */}
          <div className="h-5 flex items-start">
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

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
              Sending email...
            </>
          ) : (
            "Send Email"
          )}
        </Button>
      </form>
    </div>
  );
}
