
import React ,{ useRef } from "react";
import { Modal, Button } from "react-bootstrap";
import { VncScreen } from "react-vnc";

const VncViewerModal = ({ show, onClose, url }) => {
  const ref = useRef();
  return (
    <Modal show={show} onHide={onClose} size="lg" centered fullscreen>
      <Modal.Header closeButton>
        <Modal.Title>Console VNC</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: 0 }}>
        <div style={{ width: "100%", height: "80vh" }}>
          <VncScreen
            url={url}
            scaleViewport
            background="#000000"
            style={{
              width: '75vw',
              height: '75vh',
            }}
            ref={ref}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VncViewerModal;
