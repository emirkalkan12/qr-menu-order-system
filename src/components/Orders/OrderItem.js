import React from 'react';
import { ListGroup, Badge, Button } from 'react-bootstrap';

const OrderItem = ({ order, onStatusUpdate }) => {
  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      preparing: 'primary',
      ready: 'success',
      delivered: 'secondary'
    };
    return variants[status] || 'light';
  };

  const calculateTotal = () => {
    return order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <ListGroup.Item className="mb-2 shadow-sm">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-1">Order {order.id}</h6>
          <p className="mb-1 text-muted">{order.table}</p>
          <small>{order.time}</small>
        </div>
        <div className="text-end">
          <Badge bg={getStatusVariant(order.status)} className="mb-2 d-block">
            {order.status.toUpperCase()}
          </Badge>
          <h6 className="mb-0">${calculateTotal()}</h6>
        </div>
      </div>
      
      <div className="mt-3">
        <h6 className="mb-2">Items:</h6>
        <ListGroup variant="flush">
          {order.items.map((item, index) => (
            <ListGroup.Item key={index} className="px-0 py-1 border-0">
              {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>

      <div className="mt-3">
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={() => onStatusUpdate(order.id)}
        >
          Update Status
        </Button>
      </div>
    </ListGroup.Item>
  );
};

export default OrderItem;
