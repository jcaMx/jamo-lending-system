import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Small Business Owner",
      location: "Makila, Cotabato",
      quote: "Jamo Lending helped me expand my sari-sari store into a full grocery. Their business loan process was straightforward, and the interest rates were very reasonable. I'm so grateful for their support!",
      rating: 5,
    },
    {
      name: "Roberto Cruz",
      role: "Homeowner",
      location: "Cotabato City",
      quote: "We finally built our dream home thanks to Jamo Lending's home loan program. The team was professional, patient with all our questions, and made the entire process stress-free. Highly recommended!",
      rating: 5,
    },
    {
      name: "Jennifer Reyes",
      role: "Teacher",
      location: "Kidapawan City",
      quote: "When I needed funds for my son's college tuition, Jamo Lending was there for us. Their education loan had flexible terms that fit our budget. Thank you for investing in our children's future!",
      rating: 5,
    },
  ];

  return (
    <section style={{ backgroundColor: '#F7F5F3' }} className="py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <div className="w-24 h-1 bg-[#D97706] mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-lg shadow-sm relative"
            >
              {/* Quote Icon - matching the image style */}
              <div className="mb-4">
                <Quote className="w-12 h-12 text-[#F9D67A] fill-[#F9D67A]" strokeWidth={2} />
              </div>
              
              {/* Star Rating - fully filled */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 fill-[#D97706] text-[#D97706]" 
                    strokeWidth={0}
                  />
                ))}
              </div>
              
              {/* Quote Text */}
              <p className="text-[#787575] mb-6 italic leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              {/* Divider Line */}
              <div className="w-full h-[1px] bg-[#C5C5C5] mb-4"></div>
              
              {/* Name */}
              <p className="font-bold text-gray-900 mb-1">{testimonial.name}</p>
              
              {/* Role and Location */}
              <p className="text-sm text-[#787575]">{testimonial.role}</p>
              <p className="text-sm text-[#787575]">{testimonial.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;