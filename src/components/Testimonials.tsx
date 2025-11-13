import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Maria Santos",
      role: "Small Business Owner",
      quote: "Lemo Lending helped me expand my business with an easy and fast loan process. Their customer service was very approachable. I'm so grateful for their support!",
      rating: 5,
    },
    {
      name: "Roberto Cruz",
      role: "Homeowner",
      quote: "We finally built our dream home thanks to Lemo Lending! It was a smooth and easy process from application to approval. Highly recommend!",
      rating: 5,
    },
    {
      name: "Jennifer Reyes",
      role: "Professional",
      quote: "When I needed funds for my son's tuition, Lemo Lending was there to help. The application process was quick, and the interest rate was fair. Thank you for making it easy when I needed it most!",
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
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-cream p-6 rounded-lg">
              <div className="text-6xl text-golden/20 mb-4">"</div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-golden text-golden" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic">
                {testimonial.quote}
              </p>
              <div className="border-t border-golden/20 pt-4">
                <p className="font-bold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
