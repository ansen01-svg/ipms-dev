import { z } from "zod";

export const profileUpdateSchema = z.object({
  username: z
    .string()
    .min(1, "Username cannot be empty")
    .max(50, "Username must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  phoneNumber: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  avatar: z.string().optional(),
});

export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

export const validateForm = (data: ProfileUpdateFormData) => {
  try {
    profileUpdateSchema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};
