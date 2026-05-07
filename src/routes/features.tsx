import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Features } from "@/components/landing/Features";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Ethara.AI" },
      { name: "description", content: "AI task tracking, smart projects, team collaboration, role-based access, analytics, and smart notifications." },
      { property: "og:title", content: "Ethara.AI Features" },
      { property: "og:description", content: "Everything you need to plan, track, and ship work." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-10"><Features /></div>
      <Footer />
    </div>
  ),
});
