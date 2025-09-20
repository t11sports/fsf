const PlayersTable = () => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Player</th>
          <th className="border p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Player 1</td>
          <td className="border p-2">Active</td>
        </tr>
      </tbody>
    </table>
  );
};

export default PlayersTable;
