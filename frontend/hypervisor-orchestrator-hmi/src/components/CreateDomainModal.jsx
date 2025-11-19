import React from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

const CreateDomainModal = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  loading,
  error
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Créer un nouveau domaine</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom du domaine</Form.Label>
            <Form.Control
              name="domain_name"
              value={form.domain_name}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>CPU alloués</Form.Label>
            <Form.Control
              type="number"
              name="cpu_allocated"
              value={form.cpu_allocated}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>RAM allouée (Mo)</Form.Label>
            <Form.Control
              type="number"
              name="ram_allocated"
              value={form.ram_allocated}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chemin disque</Form.Label>
            <Form.Control
              name="disk_path"
              value={form.disk_path}
              onChange={onChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Chemin ISO</Form.Label>
            <Form.Control
              name="iso_path"
              value={form.iso_path}
              onChange={onChange}
            />
          </Form.Group>
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>

        <Button variant="primary" onClick={onSubmit} disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Création...
            </>
          ) : (
            "Créer"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateDomainModal;
