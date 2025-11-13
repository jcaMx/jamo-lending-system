const Stats = () => {
  const stats = [
    { value: "5,000+", label: "Happy Clients" },
    { value: "₱2B+", label: "Loans Distributed" },
    { value: "99%", label: "Approval Rate" },
    { value: "24/7", label: "Customer Support" },
  ];

  return (
    <section style={{ backgroundColor: '#F7F5F3' }} className="py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-golden mb-2">
              {stat.value}
            </div>
            <div className="text-navy text-sm md:text-base">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
