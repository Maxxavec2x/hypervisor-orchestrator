import React, { useState } from "react";
import { Card, Spinner, Alert, Button } from "react-bootstrap";
import DomainAccordion from "./DomainAccordion.jsx"
import CreateDomainModal from "./CreateDomainModal.jsx";
import VncViewerModal from "./VncViewerModal.jsx";

import { GetNodeInfo } from "../functions/getNodeInfo.jsx";
import { GetDomainsInfo } from "../functions/getDomainsInfo.jsx";
import { StartDomain } from "../functions/startDomain.jsx"
import { StopDomain } from "../functions/stopDomain.jsx"
import { RemoveDomain } from "../functions/removeDomain.jsx"
import { CreateDomain } from "../functions/createDomain.jsx";

export const NodeInfo = ({ nodeIp }) => {
  const { node, loading, error } = GetNodeInfo(nodeIp);
  const { domains, loading: domainsLoading, error: domainsError, refetch} = GetDomainsInfo(nodeIp);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    domain_name: "",
    cpu_allocated: "",
    ram_allocated: "",
    use_disk : false,
    disk_path: "",
    iso_path: ""
  });
  const [showVnc, setShowVnc] = useState(false);
  const [vncUrl, setVncUrl] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDomainAction = async (action, domain) => {
      setActionError(null);
      setActionLoading(true);

      try {
        await action(nodeIp, domain);
        await refetch();
      } catch (err) {
        setActionError(err.message);
      } finally {
        setActionLoading(false);
      }
   };

  const handleOpenVnc = (domain) => {
    const url = `ws://${nodeIp}:${domain.ws_port}`;
    setVncUrl(url);
    setShowVnc(true);
  };

  const handleCreateDomain = async () => {
    setActionError(null);
    setActionLoading(true);

    try {
      const formData = new FormData();
      for (let key in form) {
        if (key === "ram_allocated") {
          form["ram_allocated"] *= 1000 // Un peu dégueu, mais l'api demande une quantitée de ram en KiB MDRRRRRRRR
        }
        formData.append(key, form[key]);
      }

      await CreateDomain(nodeIp, formData);
      await refetch();

      setShowModal(false);
      setForm({
        domain_name: "",
        cpu_allocated: "",
        ram_allocated: "",
        disk_path: "",
        iso_path: ""
      });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const onDiskToggle = (checked) => {
    setForm({ ...form, use_disk: checked });

    if (!checked) {
      setForm((prev) => ({ ...prev, disk_path: "" }));
    }
  };


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
        <Button variant="primary" className="float-end" onClick={() => setShowModal(true)}>
          + Créer un domaine
        </Button>
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

 
      {actionError && (
        <Alert variant="danger" className="mb-3">
          Erreur : {actionError}
        </Alert>
      )}

      {actionLoading && (
        <div className="d-flex align-items-center mb-2">
          <Spinner animation="border" size="sm" className="me-2" />
          <span>Action en cours...</span>
        </div>
      )}
      {!domainsLoading && domains.length > 0 && (
        <DomainAccordion
          domains={domains}
          onDomainStart={(domain) => handleDomainAction(StartDomain,domain)}
          onDomainStop={(domain) => handleDomainAction(StopDomain,domain)}
          onDomainRemoval={(domain) => handleDomainAction(RemoveDomain,domain)}
          onOpenVnc={handleOpenVnc}
        />
)}

        </Card.Body>
      </Card>

    <CreateDomainModal
      show={showModal}
      onClose={() => setShowModal(false)}
      onSubmit={handleCreateDomain}
      form={form}
      onChange={handleChange}
      loading={actionLoading}
      error={actionError}
      onDiskToggle={onDiskToggle}
    />
    <VncViewerModal
      show={showVnc}
      onClose={() => setShowVnc(false)}
      url={vncUrl}
    />
    </>
  );
};

export default NodeInfo;
