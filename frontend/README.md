# iPMS Frontend

This is the frontend application for the iPMS (Integrated Project Management System) built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ipms-dev
```

### 2. Navigate to Frontend Directory

```bash
cd frontend
```

### 3. Install Dependencies

Install all required packages:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 4. Run the Development Server

Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### 5. Access the Application

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

The page auto-updates as you edit the file - perfect for development!

## Development Workflow

### Making Changes

You can start editing the application by modifying files in the `app/` directory:

- `app/page.tsx` - Main page component
- `app/layout.tsx` - Root layout component
- `app/globals.css` - Global styles

### Testing Your Changes

Before creating a pull request, ensure your changes work properly:

```bash
# Build the application for production
npm run build

# Start the production server
npm run start
```

Both commands should complete successfully without errors.

### Project Structure

```
frontend/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── public/             # Static assets
├── components/         # Reusable React components
├── lib/               # Utility functions
├── package.json       # Project dependencies
└── README.md          # This file
```

## Available Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Starts development server on port 3000 |
| `npm run build` | Builds the app for production          |
| `npm run start` | Starts production server               |
| `npm run lint`  | Runs ESLint for code quality           |

## Technology Stack

- **Framework**: [Next.js 14+](https://nextjs.org)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font Optimization**: [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) with [Geist](https://vercel.com/font)

## Contributing

1. Follow the main project's [collaboration guidelines](../README.md)
2. Create feature branches: `git checkout -b feature/your-feature-name`
3. Make your changes in the frontend directory
4. Test locally with `npm run dev`
5. Build and test production version with `npm run build && npm run start`
6. Commit and push your changes
7. Create a pull request

## Environment Setup

### Node.js Version

Ensure you have Node.js 18+ installed:

```bash
node --version  # Should be 18.0.0 or higher
```

### Package Manager

This project uses npm by default, but you can use your preferred package manager:

- **npm** (recommended)
- **yarn**
- **pnpm**
- **bun**

## Troubleshooting

### Common Issues

**Port 3000 already in use:**

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors:**

```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Build errors:**

```bash
# Check for TypeScript errors
npm run build

# Check for linting issues
npm run lint
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Next.js GitHub Repository](https://github.com/vercel/next.js) - Feedback and contributions welcome

## Deployment

The application can be deployed on various platforms:

- **Vercel** (recommended): [Deploy with Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
- **Netlify**: Supports Next.js deployments
- **Docker**: Build and deploy with containers

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for detailed deployment guides.

## Support

For project-specific questions:

- Check the main project [README](../README.md)
- Create an issue in the repository
- Contact the project maintainers

For Next.js specific questions:

- Visit [Next.js Documentation](https://nextjs.org/docs)
- Join the [Next.js Discord Community](https://discord.gg/nextjs)

<!-- code
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
import avatarImg from "@/assets/avatar.png";

interface createuserFormSchema {
  fullName: string;
  username: string;
  email: string;
  mobileNumber: string;
  password: string;
  roleId: number;
  departmentName: string;
  departmentId: number;
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
  email: z.string().email(),
  phoneNumber: z.string().length(10).regex(/^\d+$/),
  password: z
    .string()
    .min(6)
    .max(20)
    .regex(/[A-Z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
  roleId: z.string().min(1),
  departmentName: z.string().min(2).max(50),
  departmentId: z.string().min(1),
  designation: z.enum(designation as [string, ...string[]]),
  officeLocation: z.string().min(8).max(100).transform(cleanAndFormat),
});

const CreateUserPage = () => {
  const [error, setError] = useState<string>("");
  const [isSubmittingForm, setIsSubmittingForm] = useState<boolean>(false);

  const form = useForm<z.infer<typeof createuserFormSchema>>({
    resolver: zodResolver(createuserFormSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      roleId: "",
      departmentName: "",
      departmentId: "",
      designation: "",
      officeLocation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof createuserFormSchema>) => {
    setIsSubmittingForm(true);
    setError("");
    console.log("Form submitted with values:", values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-10 space-y-6 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <Image
              src={avatarImg}
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

              {/* Password - need to update*/}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
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

              <Button
                type="submit"
                disabled={
                  Object.keys(form.formState.dirtyFields).length < 10 ||
                  isSubmittingForm
                }
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
              >
                {isSubmittingForm ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Onboarding...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
              {error && (
                <p className="text-red-500 text-center text-sm">{error}</p>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;



 -->
