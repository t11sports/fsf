import axios from 'axios';
type Buyer = {
  name: string;
  email: string;
};

export const useApi = () => {
  const fetchBuyers = async () => {
    const res = await axios.get('/api/buyers');
    return res.data as Buyer[];
  };

  const createBuyer = async (data: Buyer) => {
    const res = await axios.post('/api/buyers', data);
    return res.data;
  };

  return { fetchBuyers, createBuyer };
};
