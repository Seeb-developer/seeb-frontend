import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export function useGet(url,trigger = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.user.token);       

  useEffect(() => {
    
    if (!url || !trigger) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}${url}`,{headers});
        setData(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, trigger]);

  return { data, loading, error };
}