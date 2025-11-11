
import { useState, useEffect } from 'react';

export function GetDomainsInfo(nodeIp) {
  const API_URL = `http://localhost:5000/node/${nodeIp}/domains/info`;

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!nodeIp) return; // éviter les appels inutiles

    setError(null);
    setLoading(true);

    const fetchDomains = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        const data = await res.json();
        console.log("Domains fetched:", data);
        setDomains(data);
      } catch (err) {
        console.error("Erreur GetDomains :", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDomains();
  }, [API_URL, nodeIp]);

  return { domains, loading, error };
}
