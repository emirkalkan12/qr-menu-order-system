import React from 'react';
import { Card, Button } from 'react-bootstrap';

const MenuItem = ({ item, onEdit, onDelete }) => {
  return (
    <Card className="menu-item mb-3 shadow-sm">
      <Card.Img 
        variant="top" 
        src={item.image || 'placeholder.jpg'} 
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>{item.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">${item.price}</h5>
          <div>
            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => onEdit(item)}>
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onDelete(item.id)}>
              Delete
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItem;
