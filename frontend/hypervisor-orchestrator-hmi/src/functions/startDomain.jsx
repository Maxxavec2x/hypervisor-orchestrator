

export function StartDomain(nodeIp, domain) {
  console.log(domain)
const API_URL = `http://localhost:5000/node/${nodeIp}/domains/create/${domain.name}`
    if (!nodeIp) return; // éviter les appels inutiles
    const fetchDomains = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erreur HTTP : ${res.status}`);
        }
        const data = await res.json();
        console.log("Domains fetched:", data);
        return data;
      } catch (err) {
        console.error("Erreur GetDomains :", err);
        return err;
    };
  }
  const response = fetchDomains();
  return response
}

