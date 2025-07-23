"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

interface createuserFormSchema {
  fullName: string;
  username: string;
  email: string;
  mobileNumber: string;
  roleId: string;
  departmentName: string;
  departmentId: string;
  designation: string;
  officeLocation?: string;
  status: boolean;
}

const cleanText = (value: string): string => {
  if (!value) return value;
  return value
    .replace(/[^\w\s.,'-]/g, "")
    .trim()
    .replace(/\s+/g, " ");
};

const toTitleCase = (value: string): string => {
  if (!value) return value;
  const words = value.split(" ");
  const lowerCaseWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "but",
    "or",
    "for",
    "nor",
    "as",
    "at",
    "by",
    "from",
    "in",
    "into",
    "near",
    "of",
    "on",
    "onto",
    "to",
    "with",
    "is",
    "are",
    "was",
    "were",
  ]);
  return words
    .map((word, index) => {
      if (word.length > 1 && word === word.toUpperCase()) return word;
      if (word.includes("-")) {
        return word
          .split("-")
          .map(
            (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
          )
          .join("-");
      }
      if (index === 0 || !lowerCaseWords.has(word.toLowerCase())) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.toLowerCase();
    })
    .join(" ");
};

const cleanAndFormat = (value: string): string => {
  return toTitleCase(cleanText(value));
};

const designation = ["Administrator", "JE", "AEE", "CE", "MD", "MLA"];

const createuserFormSchema = z.object({
  fullName: z.string().min(3).max(100).transform(cleanAndFormat),
  username: z.string().min(3).max(100).transform(cleanAndFormat),
  email: z.string().email("Invalid email address").toLowerCase(),
  phoneNumber: z
    .string({
      message: "Phone number is required",
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
  roleId: z
    .string()
    .min(1, "Role selection is required")
    .min(1, "Please select a role"),
  departmentName: z
    .string({
      message: "Department name is required",
    })
    .min(2, "Department name must be at least 2 characters long")
    .max(100, "Department name cannot exceed 100 characters")
    .regex(
      /^[a-zA-Z\s&.-]+$/,
      "Department name can only contain letters, spaces, ampersands, dots, and hyphens"
    )
    .refine((val) => val.trim().length > 0, "Department name cannot be empty")
    .transform(cleanAndFormat),
  departmentId: z.string().min(1, "Department selection is required"),
  designation: z
    .enum(designation as [string, ...string[]], {
      message: "Designation is required",
    })
    .refine(
      (val) => designation.includes(val as (typeof designation)[number]),
      "Please select a valid designation from the list"
    ),
  officeLocation: z
    .string({
      message: "Office location is required",
    })
    .min(5, "Office location must be at least 5 characters long")
    .max(200, "Office location cannot exceed 200 characters")
    .regex(
      /^[a-zA-Z0-9\s,.-]+$/,
      "Office location can only contain letters, numbers, spaces, commas, dots, and hyphens"
    )
    .refine(
      (val) => /[a-zA-Z]/.test(val),
      "Office location must contain at least one letter"
    )
    .refine(
      (val) => val.trim().length >= 5,
      "Office location must be at least 5 characters after trimming spaces"
    )
    .transform(cleanAndFormat),
});

const CreateUserPage = () => {
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createuserFormSchema>>({
    resolver: zodResolver(createuserFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      roleId: "",
      departmentName: "",
      departmentId: "",
      designation: "",
      officeLocation: "",
    },
  });
  console.log("User created successfully", successMsg);
  const onSubmit = async (values: z.infer<typeof createuserFormSchema>) => {
    setIsSubmittingForm(true);
    setError("");
    setSuccessMsg("");

    console.log("Form submitted with values:", values);
    try {
      const res = await fetch("http://localhost:5000/api/v1/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer token`,
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create user.");
      }

      setSuccessMsg("✅ User created successfully!");
      form.reset(); // Clear the form
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "❌ Something went wrong.");
      } else {
        setError("❌ Something went wrong.");
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 space-y-6 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <Image
              src={"/assets/images/avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full border border-white shadow-md"
            />
            <h2 className="text-xl font-semibold mt-4">Welcome Admin</h2>
            <p className="text-sm text-purple-100 mt-2 text-center">
              Empower your team with seamless user onboarding. Secure, fast, and
              reliable.
            </p>
          </div>
          <ul className="text-sm space-y-4 mt-6">
            <li>✅ Quick and free sign-up process</li>
            <li>✅ Cross-platform support</li>
            <li>✅ Secure user management tools</li>
            <li>✅ Real-time role assignment</li>
            <li>✅ Easily manage designations</li>
          </ul>
        </div>

        {/* Right Form */}
        <div className="p-10">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full flex flex-col gap-4"
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Create New User
              </h1>
              {/* Full name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Full name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name+"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* username*/}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Username <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your username"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* phone number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Contact <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Provide a phone number"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ROLE ID */}
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Role id <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Provide a role id"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* department name */}
              <FormField
                control={form.control}
                name="departmentName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Department name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department name"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DEPARTMENT ID */}
              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Department ID<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter department ID"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Designation */}

              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Designation <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designation.map((value, index) => {
                          return (
                            <SelectItem value={value} key={index}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* OFFICE location */}
              <FormField
                control={form.control}
                name="officeLocation"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Office <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your office address"
                        className="text-sm"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error message */}
              <div className="w-full">
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}
              </div>

              {/* Success message */}
              {successMsg && (
                <p className="text-green-600 text-center text-sm">
                  {successMsg}
                </p>
              )}

              <Button
                type="submit"
                disabled={
                  Object.keys(form.formState.dirtyFields).length < 9 ||
                  isSubmittingForm
                }
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
              >
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Creating user...
                  </>
                ) : (
                  "Create User"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
