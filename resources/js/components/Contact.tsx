import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section 
      id="contact" 
      className="py-16 md:py-24 px-6 md:px-12"
      style={{ 
        background: 'linear-gradient(180deg, #F7F5F3, rgba(252, 211, 77, 0.3))' 
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contact Us
          </h2>
          <div className="w-24 h-1 bg-[#D97706] mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Contact Info & Map */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D97706] rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Visit Us</h3>
                <p className="text-sm text-gray-600">
                  Purok 18 Kisante, Makilala, North Cotabato Philippines
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D97706] rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-sm text-gray-600">
                  +63 9120213776
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D97706] rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Email Us</h3>
                <p className="text-sm text-gray-600">
                  total.finance.inc@gmail.com
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-lg shadow-sm flex items-start gap-4">
              <div className="w-12 h-12 bg-[#D97706] rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Business Hours</h3>
                <p className="text-sm text-gray-600">
                  Mon - Sat: 8:00 AM - 5:00 PM
                </p>
              </div>
            </div>

            {/* Map - Figma Embed */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm h-48">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2!2d125.0!3d7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJOIDEyNcKwMDAnMDAuMCJF!5e0!3m2!1sen!2sph!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Jamo Lending Location"
              />
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <Input 
                  placeholder="Your full name" 
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Phone Number
                </label>
                <Input 
                  placeholder="Your phone number" 
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <Textarea 
                  placeholder="Your message" 
                  rows={5} 
                  className="bg-gray-50 border-gray-200 resize-none"
                />
              </div>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-semibold py-2.5"
              >
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;