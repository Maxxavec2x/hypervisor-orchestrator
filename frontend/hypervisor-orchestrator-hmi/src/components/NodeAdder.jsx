import React, { useState } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";

export const NodeAdder = ({ onAddNode }) => {
  const [ip, setIp] = useState("");

  const handleAdd = () => {
    if (!ip.trim()) return;
    onAddNode(ip);
    setIp("");
  };

  // pour fiare en sorte que la touche entrée valide l'ip
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <InputGroup className="mb-3" style={{ maxWidth: 400 }}>
      <FormControl
        placeholder="Entrez une adresse IP..."
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        onKeyDown={handleKeyPress} 
      />
      <Button variant="primary" onClick={handleAdd}>
        Ajouter
      </Button>
    </InputGroup>
  );
};
