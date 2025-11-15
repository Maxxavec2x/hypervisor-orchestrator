

export async function StartDomain(nodeIp, domain) {
  console.log(domain)
  const API_URL = `http://localhost:5000/node/${nodeIp}/domains/create/${domain.name}`
  if (!nodeIp) return; // éviter les appels inutiles
  const res = await fetch(API_URL, { method: "GET" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erreur start domain: ${res.status} - ${text}`);
  }
  return await res;
}


