import React, { useRef } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";

const CreateDomainModal = ({
  show,
  onClose,
  onSubmit,
  form,
  onChange,
  onDiskToggle,
  onIsoFileSelected,
  loading,
  error
}) => {

  const isoInputRef = useRef(null);

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

          {/* Checkbox pour activer/désactiver le disque */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Utiliser un disque existant"
              checked={form.use_disk}
              onChange={(e) => onDiskToggle(e.target.checked)}
            />
          </Form.Group>

          {/* Champ du disque si checkbox cochée */}
          {form.use_disk && (
            <Form.Group className="mb-3">
              <Form.Label>Chemin disque</Form.Label>
              <Form.Control
                name="disk_path"
                value={form.disk_path}
                onChange={onChange}
              />
            </Form.Group>
          )}

          {/* Sélecteur ISO */}
          <Form.Group className="mb-3">
            <Form.Label>Fichier ISO</Form.Label>

            <Form.Control
              type="file"
              accept=".iso"
              ref={isoInputRef}
              onChange={onIsoFileSelected}
            />

            {/* Si ISO sélectionné → afficher son nom */}
            {form.iso_file && (
              <small className="text-muted">
                Fichier sélectionné : {form.iso_file.name}
              </small>
            )}
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
