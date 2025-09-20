import { useEffect, useState } from 'react';
import axios from 'axios';

const SalesTable = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    axios.get('/api/sales').then(res => setSales(res.data));
  }, []);

  return (
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Amount</th>
        </tr>
      </thead>
      <tbody>
        {sales.map((sale, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{sale.date}</td>
            <td className="p-2 border">${sale.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SalesTable;
