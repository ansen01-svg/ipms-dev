"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import createuserFormSchema, {
  designation,
} from "@/schema/create-user/create-user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

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
              src="/assets/images/avatar.png"
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
                      Full name
                      {/* <span className="text-red-500">*</span> */}
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
                      Username
                      {/* <span className="text-red-500">*</span> */}
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
                      Email
                      <span className="text-red-500">*</span>
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
                      Role id
                      {/* <span className="text-red-500">*</span> */}
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
                      Department name
                      {/* <span className="text-red-500">*</span> */}
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
                      Department ID
                      {/* <span className="text-red-500">*</span> */}
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
                      Designation
                      <span className="text-red-500">*</span>
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
                      Office
                      {/* <span className="text-red-500">*</span> */}
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
                  Object.keys(form.formState.dirtyFields).length < 3 ||
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
