const Services = () => {
  const services = [
    {
      title: "Personal Loans",
      description: "Get the financial flexibility you need when you need it most. Our Personal Loans are designed to help you cover life's unexpected expenses, consolidate debt, or fund your dream project. With competitive interest rates and flexible repayment terms...",
    },
    {
      title: "Home Loans",
      description: "Realize your dream home you've always dreamed of! Our Home Loans offer affordable financing options to help you purchase, renovate, or refinance your property, ensuring peace of mind every step of the way.",
    },
    {
      title: "Personal Loans",
      description: "Empower your business to grow and succeed. Our Business Loans provide the capital you need to expand, acquire equipment, or manage cash flow, enabling your business to thrive in today's competitive market.",
    },
    {
      title: "Emergency Loans",
      description: "Get immediate financial support when unexpected expenses arise. Our Emergency Loans provide same-day approval and quick processing, and easy repayment options, helping you handle urgent financial needs with confidence.",
    },
  ];

  return (
    <section id="services" className="bg-cream py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-golden mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg border-2 border-golden overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] bg-gradient-to-br from-golden/20 to-blue-200/30 flex items-center justify-center">
                <span className="text-muted-foreground">Service Image {index + 1}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
