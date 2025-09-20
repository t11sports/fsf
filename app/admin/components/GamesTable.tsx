import { useEffect, useState } from 'react';
import axios from 'axios';
type Game = {
  week: number;
  home: string;
  away: string;
  date: string;
};
const GamesTable = () => {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    axios.get('/api/games').then(res => setGames(res.data));
  }, []);

  return (
    <table className="w-full mt-4 border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Week</th>
          <th className="p-2 border">Home Team</th>
          <th className="p-2 border">Away Team</th>
          <th className="p-2 border">Date</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="p-2 border">{game.week}</td>
            <td className="p-2 border">{game.home}</td>
            <td className="p-2 border">{game.away}</td>
            <td className="p-2 border">{game.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GamesTable;
