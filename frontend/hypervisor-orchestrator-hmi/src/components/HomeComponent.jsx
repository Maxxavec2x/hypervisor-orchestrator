import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import NodeInfo from "./NodeInfo";
import { Sidebar } from "./Sidebar";
import { NodeAdder } from "./NodeAdder";

export const HomeComponent = () => {
  const [nodes, setNodes] = useState([]); // liste des IPs
  const [selectedNode, setSelectedNode] = useState(null);

  const handleAddNode = (ip) => {
    if (!ip.trim() || nodes.includes(ip)) return; //permet de pas ajoute rl'ip si on l'a déjà :) 
    setNodes([...nodes, ip]);
  };

  return (
    <Container fluid>
      <Row>
        {/* Colonne gauche : sidebar */}
        <Col xs={3} md={2} className="bg-light vh-100 p-0 border-end">
          <Sidebar
            nodes={nodes}
            selectedNode={selectedNode}
            onSelectNode={setSelectedNode}
          />
        </Col>

        {/* Colonne droite : contenu principal */}
        <Col className="p-4">
          <h3 className="mb-3">Gestion des Nodes</h3>
          <NodeAdder onAddNode={handleAddNode} />
          <hr />
          {selectedNode ? (
            <NodeInfo nodeIp={selectedNode} />
          ) : (
            <p className="text-muted">Sélectionnez un node dans la barre latérale.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomeComponent;
