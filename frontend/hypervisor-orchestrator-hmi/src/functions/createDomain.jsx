export async function CreateDomain(nodeIp, formData) {
  const API_URL = `http://localhost:5000/node/${nodeIp}/domains/defineXML`;
  
  // Je suis obligé de mettre ça parce que l'api back attend l'unité de ram en Kib MDR 
  formData.set("ram_allocated", formData.get("ram_allocated") * 1000)
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
