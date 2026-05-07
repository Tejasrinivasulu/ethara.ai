import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/landing/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ethara.AI" },
      { name: "description", content: "Get in touch with the Ethara.AI team. We reply within 24 hours." },
      { property: "og:title", content: "Contact Ethara.AI" },
      { property: "og:description", content: "Reach out for partnerships, support, or sales." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-10"><Contact /></div>
      <Footer />
    </div>
  ),
});
