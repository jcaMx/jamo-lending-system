import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section 
      id="contact" 
      className="py-16 md:py-24 px-6 md:px-12"
      style={{ 
        background: 'linear-gradient(180deg, #F7F5F3, rgba(252, 211, 77, 0.5))' 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-golden mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Visit Us</h3>
                <p className="text-sm text-muted-foreground">
                  123 Finance Street, Makati, North Cavaban Philippines
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Call Us</h3>
                <p className="text-sm text-muted-foreground">
                  +63 9123987576
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground">
                  contact@lemolending.com
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg flex items-start gap-4">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold mb-2">Business Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Mon - Sat: 9:00 AM - 5:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg border-2 border-golden">
            <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
            <form className="space-y-4">
              <div>
                <Input placeholder="Full Name" className="bg-cream/50" />
              </div>
              <div>
                <Input type="email" placeholder="Email Address" className="bg-cream/50" />
              </div>
              <div>
                <Input placeholder="Phone Number" className="bg-cream/50" />
              </div>
              <div>
                <Textarea placeholder="Message" rows={6} className="bg-cream/50" />
              </div>
              <Button className="w-full bg-golden hover:bg-golden-dark text-white">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        <div className="aspect-video bg-muted rounded-lg overflow-hidden">
          {/* Placeholder for map - user can integrate actual map */}
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Map Location Here</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
