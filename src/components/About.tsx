import { Users, Shield, Heart, TrendingUp } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Users,
      title: "Our Mission",
      description: "Empower communities by providing financial support to help achieve their dreams.",
    },
    {
      icon: Shield,
      title: "Trust & Integrity",
      description: "We stand for honesty, transparency, and genuine care for your financial goals.",
    },
    {
      icon: Heart,
      title: "Client-Focused",
      description: "Your goals drive our business and your success is our top priority.",
    },
    {
      icon: TrendingUp,
      title: "Financial Growth",
      description: "Helping individuals and businesses achieve their financial dreams.",
    },
  ];

  return (
    <section id="about" className="bg-cream py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Us
          </h2>
          <div className="w-24 h-1 bg-golden mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden">
            {/* Placeholder for about image - user will provide */}
            <div className="w-full h-full bg-gradient-to-br from-golden/20 to-blue-200/30 flex items-center justify-center">
              <span className="text-muted-foreground">About Image Here</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-4">Our Values</h3>
            <p className="text-muted-foreground mb-6">
              At Lemo Lending Corporation, we believe that financial support should be simple and accessible for everyone. Our mission is to provide low-interest loans that help you achieve your goals. We value honesty, transparency, and support, ensuring you feel confident on your financial journey with us. Your success is our priority!
            </p>
            <p className="text-muted-foreground">
              Join us today and experience lending future that truly cares about you and your dreams!
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border-2 border-golden/20 hover:border-golden transition-colors">
              <div className="w-12 h-12 bg-golden rounded-lg flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg mb-2">{value.title}</h4>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
