"use client";

import { Button } from "@/components/ui/button";
import {
  resetPasswordSchema,
  ResetPasswordSchema,
} from "@/schema/auth/resetPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, LoaderCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
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

  const onSubmit = async (data: ResetPasswordSchema) => {
    try {
      await axios.post("/api/auth/reset-password", {
        newPassword: data.newPassword,
      });

      toast.success("Password changed successfully");
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Change failed");
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
        <span className="w-10 h-full bg-[#279eab] text-white flex items-center justify-center flex-shrink-0">
          <Lock className="w-4 h-4" />
        </span>
        <input
          type={showPassword[name] ? "text" : "password"}
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
            className={`w-full h-10 sm:h-11 text-sm font-medium rounded-md transition-all hover:shadow-lg ${
              isSubmitting
                ? "bg-[#279eab] text-white cursor-not-allowed opacity-80"
                : "bg-white text-gray-700 border border-[#C5C5C5] hover:bg-[#279eab] hover:text-white"
            }`}
          >
            {isSubmitting && (
              <LoaderCircle className="w-4 h-4 mr-2 animate-spin [animation-duration:0.5s]" />
            )}
            {isSubmitting ? "Changing..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
