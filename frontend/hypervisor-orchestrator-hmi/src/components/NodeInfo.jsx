import React from "react";
import { Card, Spinner, Alert, ListGroup } from "react-bootstrap";
import { GetNodeInfo } from "../functions/getNodeInfo.jsx";

export const NodeInfo = (props) => {
  const { node, loading, error } = GetNodeInfo(props.nodeIp);

  if (loading)
    return (
      <Card className="mb-3 shadow-sm">
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status" size="sm" className="me-2" />
          <span>Chargement des informations du node...</span>
        </Card.Body>
      </Card>
    );

  if (error)
    return (
      <Alert variant="danger" className="mb-3">
        <strong>Erreur :</strong> {error.text || "Impossible de récupérer les informations du node."}
      </Alert>
    );

  const node_attr = Object.keys(node);

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Header>
        <strong>Node IP :</strong> {props.nodeIp}
      </Card.Header>
      <ListGroup variant="flush">
        {node_attr.map((key) => (
          <ListGroup.Item key={key}>
            <strong>{key} :</strong> {String(node[key])}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default NodeInfo;
