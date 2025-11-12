import React from "react";
import { Card, Spinner, Alert } from "react-bootstrap";
import DomainAccordion from "./DomainAccordion.jsx"
import { GetNodeInfo } from "../functions/getNodeInfo.jsx";
import { GetDomainsInfo } from "../functions/getDomainsInfo.jsx";
import { StartDomain } from "../functions/startDomain.jsx"
export const NodeInfo = ({ nodeIp }) => {
  const { node, loading, error } = GetNodeInfo(nodeIp);
  const { domains, loading: domainsLoading, error: domainsError } = GetDomainsInfo(nodeIp);

  const handleDomainStart = (domain) => {
   try {
      console.log("test")
      console.log("node IP " + nodeIp)
      console.log(JSON.stringify(domain.name))
      const response = StartDomain(nodeIp, domain); 
      console.log(response)
    }
    catch (err) {
      console.log(err);
    }
   
  }

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
        <DomainAccordion
          domains={domains}
          onDomainStart={(domain) => handleDomainStart(domain)}
          onDomainStop={(domain) => console.log(domain)}
        />
)}

        </Card.Body>
      </Card>
    </>
  );
};

export default NodeInfo;
