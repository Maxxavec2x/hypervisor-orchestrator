import { useState, useEffect } from 'react';

export function GetNodeInfo(nodeIp) {
  
  const API_URL=`http://localhost:5000/node/${nodeIp}/info`
  const [node, setNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    const fetchNodes = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        console.log(data)
        setNode(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, [API_URL]);

  return { node, loading, error };
}
