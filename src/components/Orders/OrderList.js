import React from 'react';
import { ListGroup } from 'react-bootstrap';
import OrderItem from './OrderItem';

const OrderList = ({ orders, onStatusUpdate }) => {
  return (
    <ListGroup variant="flush">
      {orders.map((order) => (
        <OrderItem
          key={order.id}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </ListGroup>
  );
};

export default OrderList;
