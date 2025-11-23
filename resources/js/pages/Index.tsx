import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Head } from "@inertiajs/react"; // ✅ use Inertia's Head

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* ✅ Inertia Head for title/meta */}
      <Head title="Welcome" />

      <Header />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}
