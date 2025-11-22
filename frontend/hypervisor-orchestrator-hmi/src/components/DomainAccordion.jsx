
import { Accordion, Button, ButtonGroup } from "react-bootstrap";
import {renderValue} from "../functions/renderValue.js"
function DomainAccordion({ domains, onDomainStart, onDomainStop, onDomainRemoval, onOpenVnc }) {
  return (
    <Accordion>
      {domains.map((domain, index) => (
        <Accordion.Item eventKey={index.toString()} key={index}>
          <Accordion.Header>
            <div className="d-flex justify-content-between align-items-center w-100">
              <span>{domain.name || `Domaine ${index + 1}`}</span>

              {/* Boutons à droite */}
              <ButtonGroup size="sm" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="primary"
                  onClick={() => onDomainStart(domain)}
                >
                  Start
                </Button>
                <Button
                  variant="warning"
                  onClick={() => onDomainStop(domain)}
                >
                  Stop
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDomainRemoval(domain)}
                >
                  Remove
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={() => onOpenVnc(domain)}
                >
                  Console
                </Button>
              </ButtonGroup>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            {Object.entries(domain).map(([key, value]) => (
              <div key={key}>
                <strong>{key}:</strong> {renderValue(value)}
              </div>
            ))}
          </Accordion.Body>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

export default DomainAccordion;
