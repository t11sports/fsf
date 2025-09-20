import React, { useState } from 'react';
import axios from 'axios';

const Buyers = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('/api/buyers', { name, email });
    setName('');
    setEmail('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Buyers Management</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} className="border p-2 w-full" placeholder="Name" />
        <input value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full" placeholder="Email" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Add Buyer</button>
      </form>
    </div>
  );
};

export default Buyers;
