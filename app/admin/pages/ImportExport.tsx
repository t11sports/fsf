import React, { useState } from 'react';
import Papa from 'papaparse';

const ImportExport = () => {
  const [csvData, setCsvData] = useState<Record<string, string>[]>([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => setCsvData(results.data),
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Import / Export Tools</h1>
      <input type="file" onChange={handleFile} className="border p-2 mb-4" />
      <pre className="bg-gray-100 p-2 text-sm overflow-auto h-64">{JSON.stringify(csvData, null, 2)}</pre>
    </div>
  );
};

export default ImportExport;
