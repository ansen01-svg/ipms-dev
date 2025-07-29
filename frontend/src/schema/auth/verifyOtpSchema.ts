import { z } from "zod";

export const verifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only digits"),
});

export type VerifyOtpSchema = z.infer<typeof verifyOtpSchema>;
