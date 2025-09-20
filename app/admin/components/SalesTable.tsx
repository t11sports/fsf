const SalesTable = () => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Date</th>
          <th className="border p-2">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">2025-09-01</td>
          <td className="border p-2">$100</td>
        </tr>
      </tbody>
    </table>
  );
};

export default SalesTable;
