import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { About } from "@/components/landing/About";
import { Features } from "@/components/landing/Features";
import { Contact } from "@/components/landing/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ethara.AI — Smart AI-Powered Project & Task Management" },
      { name: "description", content: "AI-native workspace for planning, tracking, and shipping work. Built for modern teams." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <section className="pt-14 pb-2">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-5xl md:text-6xl font-bold leading-tight">
              About <span className="text-gradient">Ethara.AI</span>
            </h2>
          </div>
        </section>
        <About />
        <Features />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
