import { Users, Shield, Heart, TrendingUp } from "lucide-react";
import aboutImg from "../assets/about/about.png";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Our Mission",
      description: "Empower communities by providing financial opportunities that support growth and success",
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "We stand for honesty, transparency, and genuine support in every client relationship",
    },
    {
      icon: Heart,
      title: "Client-Focused",
      description: "Your goals drive our purpose, and your success is our top priority",
    },
    {
      icon: TrendingUp,
      title: "Financial Growth",
      description: "Helping individuals and businesses achieve their financial aspirations",
    },
  ];

  return (
    <section
      id="about"
      className="py-16 md:py-24 px-6 md:px-12"
      style={{
        background: 'linear-gradient(180deg, rgba(252, 211, 77, 0.3), #F7F5F3)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Us
          </h2>
          <div className="w-24 h-1 bg-[#D97706] mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          {/* Image with overlay badge */}
          <div className="relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={aboutImg}
              alt="About Jamo Lending Corporation"
              className="w-full h-auto object-cover"
            />
            {/* Orange badge overlay */}
            <div className="absolute bottom-6 right-6 bg-[#D97706] text-white px-6 py-4 rounded-lg shadow-xl">
              <div className="text-4xl font-bold leading-none mb-1">5+</div>
              <div className="text-xs font-medium">Years Experience</div>
            </div>
          </div>
          {/* Text content */}
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-900">Our Values</h3>
            <p className="text-2xl text-gray-700 mb-4 leading-relaxed">
              At Jamo Lending Corporation, we believe in making finance simple and accessible for everyone. Our mission is to provide low-interest loans that help you achieve your dreams. We value honesty, transparency, and support, ensuring you feel confident on your financial journey with us. Your success is our priority!
            </p>
            <p className="text-2xl text-gray-700 leading-relaxed">
              Join us today and experience lending that truly cares about you and your future!
            </p>
          </div>
        </div>
        {/* Value cards at bottom */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border-2 border-transparent hover:border-[#D97706] hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#D97706] rounded-lg flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-lg text-gray-900">{value.title}</h4>
              </div>
              <p className="text-base text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;