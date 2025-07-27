"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/schemas/auth/forgotPasswordSchema";
import { Mail, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      await axios.post("/api/auth/forgot-password", { email: data.email });
      toast.success("OTP sent to your email");
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      let message = "Failed to send OTP";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
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
            <span className="w-10 h-10 bg-[#279eab] text-white flex items-center justify-center rounded-l-sm">
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
          className={`w-full border border-[#C5C5C5] text-sm font-medium py-3 rounded-md transition-all ${
            isSubmitting
              ? "bg-[#279eab] text-white cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-[#279eab] hover:text-white"
          }`}
        >
          {isSubmitting && (
            <LoaderCircle className="w-4 h-4 mr-2 animate-spin [animation-duration:0.5s]" />
          )}
          {isSubmitting ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    </div>
  );
}
