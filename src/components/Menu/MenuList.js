import React from 'react';
import { Row, Col } from 'react-bootstrap';
import MenuItem from './MenuItem';

const MenuList = ({ items, onEdit, onDelete }) => {
  return (
    <Row>
      {items.map((item) => (
        <Col key={item.id} md={4} sm={6} className="mb-4">
          <MenuItem 
            item={item} 
            onEdit={onEdit} 
            onDelete={onDelete}
          />
        </Col>
      ))}
    </Row>
  );
};

export default MenuList;
