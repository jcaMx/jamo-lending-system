import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const Hero = () => {
  return (
    <section style={{ backgroundColor: '#EDEDED' }} className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
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
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Quick approval process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Competitive interest rates</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-foreground">Flexible payment terms</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="bg-golden hover:bg-golden-dark text-white px-8">
              Apply Now
            </Button>
            <Button variant="link" className="text-foreground">
              Contact Us
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[4/3] rounded-lg overflow-hidden" style={{ backgroundColor: '#EDEDED' }}>
            {/* Placeholder for hero image - user will provide */}
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#EDEDED', mixBlendMode: 'multiply' }}>
              <span className="text-muted-foreground">Hero Image Here</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
