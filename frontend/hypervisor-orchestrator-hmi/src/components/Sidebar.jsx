import React from "react";
import { ListGroup } from "react-bootstrap";

export const Sidebar = ({ nodes, selectedNode, onSelectNode }) => {
  return (
    <div className="p-3">
      <h5 className="mb-3">Nodes</h5>
      <ListGroup>
        {nodes.length === 0 && (
          <ListGroup.Item className="text-muted">
            Aucun node ajouté
          </ListGroup.Item>
        )}
        {nodes.map((ip) => (
          <ListGroup.Item
            key={ip}
            action
            active={ip === selectedNode}
            onClick={() => onSelectNode(ip)}
          >
            {ip}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

