import React from 'react';

const Players = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Players Management</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">John Doe</td>
            <td className="border p-2">Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Players;
