import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white shadow p-4 rounded-xl">Total Sales: $5000</div>
        <div className="bg-white shadow p-4 rounded-xl">Players: 120</div>
        <div className="bg-white shadow p-4 rounded-xl">Games: 8</div>
      </div>
    </div>
  );
};

export default Dashboard;
