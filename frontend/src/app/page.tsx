import Header from "@/components/home/header";
import HeroSection from "@/components/home/hero-section";
import AboutUsSection from "@/components/home/about-section";
import Footer from "@/components/home/footer";
import dynamic from "next/dynamic";

// Dynamically import to avoid SSR issues with "use client"
const Dashboard = dynamic(() => import("./dashboard/Dashboard"), { ssr: false });
/**
 * Main Landing Page Component
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header className="sticky top-0 z-50" />

      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutUsSection />
      {/* Admin Dashboard */}
       {/* <Dashboard /> */}
      {/* Footer */}
      <Footer />
    </div>
  );
}
