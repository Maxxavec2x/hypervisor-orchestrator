
import React, { useState } from 'react';
import { InputGroup, FormControl, Button, ListGroup } from 'react-bootstrap';
import NodeInfo from './NodeInfo.jsx';

const NodeList = () => {
  const [ipInput, setIpInput] = useState('');
  const [nodes, setNodes] = useState([]);

  const handleAddNode = () => {
    if (!ipInput.trim()) return;
    const newNode = { id: Date.now(), ip: ipInput };
    setNodes([...nodes, newNode]);
    setIpInput('');
  };

  return (
    <div className="p-3">
      {/* Barre d'ajout */}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Entrez l'adresse IP d'un node..."
          value={ipInput}
          onChange={(e) => setIpInput(e.target.value)}
        />
        <Button variant="primary" onClick={handleAddNode}>
          Ajouter
        </Button>
      </InputGroup>

      {/* Liste des nodes */}
      <ListGroup>
        {nodes.map((node) => (
          <ListGroup.Item key={node.id}>
            <NodeInfo nodeIp={node.ip} />
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default NodeList;
