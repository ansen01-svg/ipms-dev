import { z } from "zod";

// export const loginSchema = z.object({
//   userId: z.string().min(1, "User ID is required."),
//   password: z
//     .string()
//     .min(6, "Password must be at least 6 characters.")
//     .refine((val) => /[a-zA-Z]/.test(val), {
//       message: "Password must contain at least one letter.",
//     })
//     .refine((val) => /[^a-zA-Z0-9]/.test(val), {
//       message: "Password must contain at least one special character.",
//     }),
//   rememberMe: z.boolean().optional(),
// });

export const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .refine((val) => /[a-zA-Z]/.test(val), {
      message: "Password must contain at least one letter.",
    }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
