import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Link } from "@inertiajs/react"; // ✅ use Inertia's Link
import heroImg from "../assets/hero/hero.png";

const Hero = () => {
  return (
    <section style={{ backgroundColor: "#F7F5F3" }} className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center min-h-[600px]">
        <div className="py-16 md:py-24 px-6 md:px-12 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Low Rates,<br />
            <span className="text-golden">Big Dreams</span><br />
            Made Possible
          </h1>

          <p className="text-muted-foreground mb-6 text-lg">
            Your trusted partner for finance and lending solutions. We offer quick and reliable loan services, designed to help your goals to reality!
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-golden flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Quick approval process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-golden flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Competitive interest rates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-golden flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Flexible payment terms</span>
            </div>
          </div>

          <div className="flex gap-4">
            {/* ✅ Inertia navigation */}
            <Link href="/apply">
              <Button className="bg-yellow-400 hover:bg-golden-dark text-black px-8">
                Apply Now
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="link" className="text-foreground">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative h-full min-h-[600px] md:absolute md:right-0 md:top-0 md:w-1/2">
          {/* Gradient overlay for smooth blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5F3] via-[#F7F5F3]/50 to-transparent z-10 w-32 md:w-48"></div>

          {/* Hero image */}
          <img
            src={heroImg}
            alt="Hero — JAMO Lending"
            className="object-cover w-full h-full"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
