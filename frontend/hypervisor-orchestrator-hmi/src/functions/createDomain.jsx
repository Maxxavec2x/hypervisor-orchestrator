export async function CreateDomain(nodeIp, formData) {
  const API_URL = `http://${nodeIp}:5000/domain/create`;

  const res = await fetch(API_URL, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Erreur lors de la création du domaine");
  }

  return await res;
}
