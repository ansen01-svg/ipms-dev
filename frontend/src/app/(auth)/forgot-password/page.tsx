"use client";

import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  ForgotPasswordSchema,
} from "@/schema/auth/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, LoaderCircle, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

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
        let errorMessage = "Failed to send reset email";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Store the email and show success card
      setSubmittedEmail(data.email);
      setEmailSent(true);
      reset();
      toast.success("Password reset email sent successfully!");
    } catch (error: unknown) {
      let message = "Failed to send reset email";

      if (error instanceof Error) {
        message = error.message;
      }

      toast.error(message);
    }
  };

  const handleSendAnother = () => {
    setEmailSent(false);
    setSubmittedEmail("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      {!emailSent ? (
        // Forgot Password Form
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
              "Send Reset Email"
            )}
          </Button>
        </form>
      ) : (
        // Success Message Card
        <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Email Sent Successfully!
            </h2>
            <p className="text-gray-600 text-sm">
              {`We've sent a password reset link to:`}
            </p>
            <p className="text-teal-600 font-semibold text-base">
              {submittedEmail}
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-800">Next steps:</strong>
            </p>
            <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the password reset link</li>
              <li>Create a new password</li>
            </ol>
            <p className="text-xs text-gray-600 mt-3">
              ⏰ The link will expire in <strong>1 hour</strong> for security
              reasons.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-gray-700">
              <strong>Note:</strong>{" "}
              {`If you don't see the email, check your spam
              folder.`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSendAnother}
              className="w-full h-10 bg-teal-600 text-white hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 active:bg-teal-800 rounded-md transition-all duration-200"
            >
              Send to Another Email
            </Button>

            <Button
              onClick={() => (window.location.href = "/login")}
              variant="outline"
              className="w-full h-10 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-all duration-200"
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
