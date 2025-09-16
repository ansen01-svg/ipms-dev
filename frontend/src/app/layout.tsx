import RouteGuard from "@/components/auth/route-guard";
import { AuthProvider } from "@/contexts/auth-context";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "INTEGRATED PROJECT MONITORING SYSTEM",
  description:
    "A comprehensive system for monitoring government projects in Assam.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <RouteGuard requireAuth={true}>
            {children}
            <Toaster
              position="top-center"
              richColors
              toastOptions={{
                style: { fontSize: "14px" },
                className: "text-sm",
              }}
            />
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
