import { z } from "zod";

export const designation = [
  "ADMIN",
  "JE",
  "AEE",
  "CE",
  "MD",
  "VIEWER",
  "OPERATOR",
];

const createuserFormSchema = z.object({
  fullName: z.string(),
  username: z.string(),
  email: z.string().email("Invalid email address").toLowerCase(),
  phoneNumber: z
    .string({
      error: "Phone number is required",
    })
    .min(10, "Phone number must be exactly 10 digits")
    .max(10, "Phone number must be exactly 10 digits")
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid Indian mobile number (must start with 6, 7, 8, or 9)"
    )
    .refine(
      (val) => !/^(\d)\1{9}$/.test(val),
      "Phone number cannot be all same digits"
    ),
  roleId: z.string(),
  departmentName: z.string(),
  departmentId: z.string(),

  // designation: z
  //   .enum(designation as [string, ...string[]], {
  //     error: "Designation is required",
  //   })
  //   .refine(
  //     (val) => designation.includes(val as (typeof designation)[number]),
  //     "Please select a valid designation from the list"
  //   ),
  designation: z.enum(designation as [string, ...string[]]),

  officeLocation: z.string(),
});

export default createuserFormSchema;
