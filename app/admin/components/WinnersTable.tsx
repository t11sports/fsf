import { useEffect, useState } from 'react';
import axios from 'axios';

type Winner = {
  game: string;
  name: string;
};

const WinnersTable = () => {
  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    axios.get('/api/winners').then(res => setWinners(res.data));
  }, []);

  return (
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Game</th>
          <th className="p-2 border">Winner</th>
        </tr>
      </thead>
      <tbody>
        {winners.map((winner, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{winner.game}</td>
            <td className="p-2 border">{winner.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WinnersTable;
