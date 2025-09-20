const DashboardSummary = () => {
  const stats = [
    { title: 'Total Sales', value: '$5,000' },
    { title: 'Players', value: '120' },
    { title: 'Games', value: '8' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow p-6 text-center">
          <div className="text-sm text-gray-500">{stat.title}</div>
          <div className="text-xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;
