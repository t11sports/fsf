import axios from 'axios';

export const useApi = () => {
  const fetchBuyers = async () => {
    const res = await axios.get('/api/buyers');
    return res.data;
  };

  const createBuyer = async (data) => {
    const res = await axios.post('/api/buyers', data);
    return res.data;
  };

  return { fetchBuyers, createBuyer };
};
