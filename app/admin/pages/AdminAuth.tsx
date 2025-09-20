import React from 'react';

const AdminAuth = () => {
  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form className="space-y-4">
        <input type="email" placeholder="Email" className="border p-2 w-full" />
        <input type="password" placeholder="Password" className="border p-2 w-full" />
        <button className="bg-red-600 text-white px-4 py-2 rounded" type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminAuth;
