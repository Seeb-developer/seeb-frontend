import { useState } from 'react';
import axios from 'axios';

export function usePost(url, token = null) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postData = async (payload) => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}${url}`, payload, { headers });
      setResponse(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { postData, response, loading, error };
}