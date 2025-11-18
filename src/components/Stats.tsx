const Stats = () => {
  const stats = [
    { value: "5,000+", label: "Happy Clients" },
    { value: "₱2B+", label: "Loans Distributed" },
    { value: "99%", label: "Approval Rate" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section className="relative bg-navy py-16 md:py-20 px-6 md:px-12 overflow-hidden">
      {/* Gradient overlay blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent, rgba(252, 211, 77, 0.5))'
        }}
      />
      
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl md:text-4xl font-bold mb-2 text-white">
              {stat.value}
            </div>
            <div className="text-sm md:text-base text-white/80">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
