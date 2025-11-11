import { useState, useEffect } from 'react';

const API_URL="http://localhost:5000/node/localhost/info"

export function GetNodeInfo() {
  const [node, setNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

  return { node, loading, error };
}
