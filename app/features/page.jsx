"use client"
import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import { useRouter } from "next/navigation";
import { useUser } from "../provider";
import { Spotlight } from "@/components/ui/spotlight";

export default function FeaturesPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  const onDashboard = () => {
    if (loading) {
      return;
    }

    if (!user) {
      router.push("/auth");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Spotlight
        className="-top-20 left-0 sm:-top-40 sm:left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Navbar onDashboard={onDashboard} />
      <Features />
    </div>
  );
}
