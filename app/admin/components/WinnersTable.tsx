const WinnersTable = () => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Game</th>
          <th className="border p-2">Winner</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Week 1</td>
          <td className="border p-2">John Doe</td>
        </tr>
      </tbody>
    </table>
  );
};

export default WinnersTable;
