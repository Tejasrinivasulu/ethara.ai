import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { About } from "@/components/landing/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Ethara.AI" },
      { name: "description", content: "Learn how Ethara.AI helps teams manage projects, tasks, and collaboration with AI." },
      { property: "og:title", content: "About Ethara.AI" },
      { property: "og:description", content: "AI-native project management for modern teams." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-10"><About /></div>
      <Footer />
    </div>
  ),
});
