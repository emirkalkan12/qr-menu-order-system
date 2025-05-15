import React, { useState } from 'react';
import { Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import QRGenerator from '../components/QR/QRGenerator';

const TableManagement = () => {
  const [tables, setTables] = useState([
    { id: 1, number: 1, status: 'boş', capacity: 4, orders: [] },
    { id: 2, number: 2, status: 'dolu', capacity: 6, orders: ['#001'] },
    { id: 3, number: 3, status: 'boş', capacity: 2, orders: [] },
    { id: 4, number: 4, status: 'rezerve', capacity: 4, orders: [] }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [formData, setFormData] = useState({
    number: '',
    capacity: 4
  });

  const statusColors = {
    'boş': 'success',
    'dolu': 'danger',
    'rezerve': 'warning'
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTable = () => {
    if (!formData.number) {
      setAlert({
        show: true,
        message: 'Lütfen masa numarasını girin!',
        variant: 'danger'
      });
      return;
    }

    const newTable = {
      id: tables.length + 1,
      number: parseInt(formData.number),
      capacity: parseInt(formData.capacity),
      status: 'boş',
      orders: []
    };

    setTables(prev => [...prev, newTable]);
    setFormData({ number: '', capacity: 4 });
    setShowAddModal(false);
    setAlert({
      show: true,
      message: 'Masa başarıyla eklendi!',
      variant: 'success'
    });
  };

  const handleShowQR = (table) => {
    setSelectedTable(table);
    setShowQRModal(true);
  };

  const handleStatusChange = (tableId, newStatus) => {
    setTables(prev => prev.map(table =>
      table.id === tableId ? { ...table, status: newStatus } : table
    ));
  };

  return (
    <div>
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({ ...alert, show: false })} 
          dismissible
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Masa Yönetimi</h2>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle"></i>
          Yeni Masa Ekle
        </Button>
      </div>

      <Row>
        {tables.map((table) => (
          <Col key={table.id} sm={6} md={4} lg={3} className="mb-4">
            <Card className={`shadow-sm border-${statusColors[table.status]}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0">Masa {table.number}</h5>
                  <span className={`badge bg-${statusColors[table.status]}`}>
                    {table.status.toUpperCase()}
                  </span>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Kapasite:</small>
                  <div>{table.capacity} Kişilik</div>
                </div>

                {table.orders.length > 0 && (
                  <div className="mb-3">
                    <small className="text-muted">Aktif Siparişler:</small>
                    <div>{table.orders.join(', ')}</div>
                  </div>
                )}

                <div className="d-grid gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShowQR(table)}
                  >
                    <i className="bi bi-qr-code me-2"></i>
                    QR Kodu
                  </Button>
                  
                  <Form.Select
                    size="sm"
                    value={table.status}
                    onChange={(e) => handleStatusChange(table.id, e.target.value)}
                  >
                    <option value="boş">Boş</option>
                    <option value="dolu">Dolu</option>
                    <option value="rezerve">Rezerve</option>
                  </Form.Select>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Masa Ekleme Modalı */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Masa Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Masa Numarası*</Form.Label>
              <Form.Control
                type="number"
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder="Masa numarasını girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kapasite</Form.Label>
              <Form.Select
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
              >
                <option value="2">2 Kişilik</option>
                <option value="4">4 Kişilik</option>
                <option value="6">6 Kişilik</option>
                <option value="8">8 Kişilik</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleAddTable}>
            Masa Ekle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* QR Kod Modalı */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Masa {selectedTable?.number} QR Kodu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTable && (
            <QRGenerator
              tableNumber={selectedTable.number}
              url={`http://localhost:3000/menu?table=${selectedTable.number}`}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQRModal(false)}>
            Kapat
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TableManagement;
