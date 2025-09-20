import { useEffect, useState } from 'react';
import axios from 'axios';

const PlayersTable = () => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    axios.get('/api/players').then(res => setPlayers(res.data));
  }, []);

  return (
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Player</th>
          <th className="p-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {players.map((player, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{player.name}</td>
            <td className="p-2 border">{player.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PlayersTable;
