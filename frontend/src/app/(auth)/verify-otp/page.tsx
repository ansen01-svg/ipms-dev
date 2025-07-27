import { Suspense } from "react";
import VerifyOTPForm from "@/components/verify-otp/verify-otp";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}
