const BuyersTable = () => {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Name</th>
          <th className="border p-2">Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border p-2">Jane Doe</td>
          <td className="border p-2">jane@example.com</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BuyersTable;
