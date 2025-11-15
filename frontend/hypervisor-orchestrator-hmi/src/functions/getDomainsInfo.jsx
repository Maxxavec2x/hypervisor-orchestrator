
import { useState, useEffect, useCallback } from 'react';

export  function GetDomainsInfo(nodeIp) {
const API_URL = `http://localhost:5000/node/${nodeIp}/domains/info`;

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDomains = useCallback(async () => {
    if (!nodeIp) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);
      const data = await res.json();
      setDomains(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [API_URL, nodeIp]);

  useEffect(() => {
    fetchDomains();
  }, [fetchDomains]);

  return { domains, loading, error, refetch: fetchDomains };
}
