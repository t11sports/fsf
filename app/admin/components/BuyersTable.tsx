import { useEffect, useState } from 'react';
import axios from 'axios';

type Buyer = {
  name: string;
  email: string;
};

const BuyersTable = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);

  useEffect(() => {
    axios.get('/api/buyers').then(res => setBuyers(res.data));
  }, []);

  return (
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
        </tr>
      </thead>
      <tbody>
        {buyers.map((buyer, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{buyer.name}</td>
            <td className="p-2 border">{buyer.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BuyersTable;
