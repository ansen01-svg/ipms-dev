/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import image from "../images/emblem-dark.png";
import Logo from "../images/logo.jpg";
import Portal from "../images/india-gov_0.png";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // validation check here
  const validateForm = () => {
    if (!userId.trim() || !password.trim()) {
      toast.error("User ID and password are required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        "/api/auth/login",
        { userId, password },
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success("Login successful!");

      // Reset form values
      setUserId("");
      setPassword("");

      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error with response
        const errorMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Login failed.";
        toast.error(errorMsg);
      } else if (error instanceof Error) {
        // Fallback for unexpected error
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen font-sans text-sm">
      {/* Left Panel */}
      <div className="relative bg-[#822a4c] text-white px-6 py-10 flex flex-col justify-center items-center overflow-hidden">
        <Image
          src={Portal}
          alt="Background"
          className="object-cover opacity-80"
        />
        <div className="relative z-10 text-center max-w-md">
          <Image
            src={Portal}
            alt="India Logo"
            width={50}
            height={50}
            className="mx-auto my-2"
          />
          <h1 className="text-base font-bold uppercase tracking-wide">
            INTEGRATED PROJECT MONITORING SYSTEM
          </h1>
          <h2 className="text-4xl font-extrabold mt-4">IPMS</h2>
          <p className="text-sm tracking-wide uppercase">
            Monitoring and Data Analytic System
          </p>
          <p className="text-[11px] mt-6">
            Designed, Developed & Maintained by
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold">
            <Image
              src={Logo}
              alt="CDTS Logo"
              width={60}
              height={80}
              className="pt-5"
            />
            <span>GRATIA TECHNOLOGY</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-col justify-center items-center p-10 md:p-16 bg-white w-full pt-14">
        <div className="w-full max-w-[600px] space-y-10 bg-white p-8 rounded-md shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Image
                src={image}
                alt="Council Logo"
                width={24}
                height={24}
                className="rounded"
              />
              <h1 className="text-xl font-bold text-[#1266ab]">
                INTEGRATED PROJECT MONITORING SYSTEM
              </h1>
            </div>
            <p className="text-[15px] text-red-600 font-semibold mt-1">
              A GOVT OF ASSAM UNDERTAKING
            </p>
          </div>

          <div className="border border-gray-300 p-8 rounded-md shadow-sm w-full">
            <h2 className="text-center text-lg font-semibold text-[#822a4c] mb-5">
              User Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* User ID */}
              <div>
                <label className="block text-[12px] font-semibold mb-1">
                  User ID
                </label>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-10 h-8 bg-[#822a4c] rounded-l-sm">
                    <User className="w-4 h-4 text-white" />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    className="flex-1 h-8 px-3 border-t border-b border-r border-[#822a4c] text-[13px] text-black placeholder:text-gray-500 focus:outline-none rounded-r-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[13px] font-semibold mb-1">
                  Password
                </label>
                <div className="flex items-center">
                  <span className="flex items-center justify-center w-10 h-8 bg-[#822a4c] rounded-l-sm">
                    <Lock className="w-4 h-4 text-white" />
                  </span>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="flex-1 h-8 px-3 border-t border-b border-r border-[#822a4c] text-[13px] text-black placeholder:text-gray-500 focus:outline-none rounded-r-sm"
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-[#822a4c] font-medium"
                >
                  Remember Me
                </label>
              </div>

              {/* Error */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center gap-2 border border-[#822a4c] text-sm font-medium py-4 rounded transition-colors ${
                  loading
                    ? "bg-[#822a4c] text-white cursor-not-allowed"
                    : "text-[#822a4c] hover:bg-[#822a4c] hover:text-white"
                }`}
              >
                {loading && (
                  <LoaderCircle className="w-4 h-4 animate-spin [animation-duration:0.5s]" />
                )}
                {loading ? "Signing in..." : "SIGN IN"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
