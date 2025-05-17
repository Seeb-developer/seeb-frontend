import { useState } from 'react';
import axios from 'axios';

export function useDelete() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteData = async (url, token = null) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};     
      const res = await axios.delete(`${import.meta.env.VITE_BASE_URL}${url}`, { headers });
      setResponse(res.data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return { deleteData, response, loading, error };
}
