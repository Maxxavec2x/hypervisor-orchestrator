
// Fonction utilitaire utilisé notamment pour l'affichage des domaines.

export function renderValue(value) {
  if (typeof value === "object" && value !== null) {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else {
      return (
        <ul>
          {Object.entries(value).map(([k, v]) => (
            <li key={k}>
              <strong>{k}:</strong> {renderValue(v)}
            </li>
          ))}
        </ul>
      );
    }
  }
  return String(value);
}
