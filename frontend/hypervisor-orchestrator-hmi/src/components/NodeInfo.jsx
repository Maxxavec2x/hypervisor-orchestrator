import React from "react";
import { Card, Spinner, Alert, Accordion } from "react-bootstrap";
import { GetNodeInfo } from "../functions/getNodeInfo.jsx";
import { GetDomainsInfo } from "../functions/getDomainsInfo.jsx";
import {renderValue} from "../functions/renderValue.js";
export const NodeInfo = ({ nodeIp }) => {
  const { node, loading, error } = GetNodeInfo(nodeIp);
  const { domains, loading: domainsLoading, error: domainsError } = GetDomainsInfo(nodeIp);

  if (loading)
    return (
      <Card className="mb-3 shadow-sm">
        <Card.Body className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" size="sm" className="me-2" />
          Chargement des informations du node...
        </Card.Body>
      </Card>
    );

  if (error)
    return (
      <Alert variant="danger">
        Erreur lors du chargement du node : {error.message}
      </Alert>
    );

  return (
    <>
      {/* --- Infos du node --- */}
      <Card className="mb-3 shadow-sm">
        <Card.Header>
          <strong>Node IP :</strong> {nodeIp}
        </Card.Header>
        <Card.Body>
          {Object.entries(node).map(([key, value]) => (
            <div key={key}>
              <strong>{key} :</strong> {String(value)}
            </div>
          ))}
        </Card.Body>
      </Card>

      {/* --- Infos des domaines avec Accordion --- */}
      <Card className="shadow-sm">
        <Card.Header>
          <strong>Domaines</strong>
        </Card.Header>
        <Card.Body>
          {domainsLoading && (
            <div className="d-flex align-items-center">
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Chargement des domaines...</span>
            </div>
          )}

          {domainsError && (
            <Alert variant="warning">
              Erreur lors du chargement des domaines : {domainsError.message}
            </Alert>
          )}

          {!domainsLoading && !domainsError && domains.length === 0 && (
            <p className="text-muted">Aucun domaine trouvé pour ce node.</p>
          )}

          
      {!domainsLoading && domains.length > 0 && (
      <Accordion defaultActiveKey="0">
        {domains.map((domain, index) => (
          <Accordion.Item eventKey={index.toString()} key={index}>
            <Accordion.Header>{domain.name || `Domaine ${index + 1}`}</Accordion.Header>
            <Accordion.Body>
              {Object.entries(domain).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <strong>{key}:</strong> {renderValue(value)}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      )}

        </Card.Body>
      </Card>
    </>
  );
};

export default NodeInfo;
