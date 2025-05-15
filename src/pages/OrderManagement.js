import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Modal, Form, Alert } from 'react-bootstrap';

const OrderManagement = () => {
  const [orders, setOrders] = useState([
    {
      id: '#001',
      masa: 'Masa 1',
      items: [
        { name: 'Klasik Burger', quantity: 2, price: 120 },
        { name: 'Kola', quantity: 2, price: 25 }
      ],
      status: 'beklemede',
      time: '14:30',
      total: 290,
      musteriAdi: 'Ahmet Yılmaz',
      notlar: 'Burger soğansız olsun'
    },
    {
      id: '#002',
      masa: 'Masa 4',
      items: [
        { name: 'Sezar Salata', quantity: 1, price: 85 },
        { name: 'Soğuk Çay', quantity: 1, price: 30 }
      ],
      status: 'hazirlaniyor',
      time: '14:45',
      total: 115,
      musteriAdi: 'Ayşe Kara',
      notlar: 'Salata sosu ayrı gelsin'
    }
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('tümü');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

  const durumSecenekleri = [
    'beklemede',
    'hazirlaniyor',
    'hazir',
    'teslim_edildi',
    'iptal_edildi'
  ];

  const durumCevirileri = {
    beklemede: 'Beklemede',
    hazirlaniyor: 'Hazırlanıyor',
    hazir: 'Hazır',
    teslim_edildi: 'Teslim Edildi',
    iptal_edildi: 'İptal Edildi'
  };

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setAlert({
      show: true,
      message: `${orderId} numaralı sipariş durumu "${durumCevirileri[newStatus]}" olarak güncellendi`,
      variant: 'success'
    });
  };

  const getDurumRozeti = (status) => {
    const variants = {
      beklemede: 'warning',
      hazirlaniyor: 'primary',
      hazir: 'success',
      teslim_edildi: 'secondary',
      iptal_edildi: 'danger'
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {durumCevirileri[status]}
      </Badge>
    );
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const filteredOrders = statusFilter === 'tümü' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

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
        <h2>Sipariş Yönetimi</h2>
        <div className="d-flex gap-2">
          <Form.Select 
            style={{ width: '200px' }} 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="tümü">Tüm Siparişler</option>
            {durumSecenekleri.map(status => (
              <option key={status} value={status}>
                {durumCevirileri[status]}
              </option>
            ))}
          </Form.Select>
          <Button variant="outline-primary">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Yenile
          </Button>
        </div>
      </div>

      <Row>
        {/* İstatistik Kartları */}
        <Col md={12} className="mb-4">
          <Row>
            {durumSecenekleri.map(status => (
              <Col key={status}>
                <Card className="text-center h-100">
                  <Card.Body>
                    <h6 className="text-muted text-uppercase mb-2">
                      {durumCevirileri[status]}
                    </h6>
                    <h3 className="mb-0">
                      {orders.filter(order => order.status === status).length}
                    </h3>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Sipariş Listesi */}
        {filteredOrders.map(order => (
          <Col key={order.id} md={6} lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h5 className="mb-1">Sipariş {order.id}</h5>
                    <p className="text-muted mb-0">{order.masa}</p>
                  </div>
                  {getDurumRozeti(order.status)}
                </div>

                <div className="mb-3">
                  <small className="text-muted">Ürünler:</small>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="ms-2">
                      {item.quantity}x {item.name}
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted">Toplam:</span>
                  <span className="fw-bold">{order.total.toLocaleString('tr-TR')} ₺</span>
                </div>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleShowDetails(order)}
                  >
                    <i className="bi bi-eye me-1"></i>
                    Detaylar
                  </Button>
                  <Form.Select
                    size="sm"
                    style={{ width: '130px' }}
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                  >
                    {durumSecenekleri.map(status => (
                      <option key={status} value={status}>
                        {durumCevirileri[status]}
                      </option>
                    ))}
                  </Form.Select>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Sipariş Detay Modalı */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Sipariş Detayı - {selectedOrder?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Müşteri Bilgileri</h6>
                  <p className="mb-1"><strong>Ad:</strong> {selectedOrder.musteriAdi}</p>
                  <p className="mb-1"><strong>Masa:</strong> {selectedOrder.masa}</p>
                  <p className="mb-1"><strong>Saat:</strong> {selectedOrder.time}</p>
                </Col>
                <Col md={6}>
                  <h6>Sipariş Durumu</h6>
                  {getDurumRozeti(selectedOrder.status)}
                </Col>
              </Row>

              <h6>Sipariş İçeriği</h6>
              <table className="table">
                <thead>
                  <tr>
                    <th>Ürün</th>
                    <th>Adet</th>
                    <th>Birim Fiyat</th>
                    <th>Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString('tr-TR')} ₺</td>
                      <td>{(item.quantity * item.price).toLocaleString('tr-TR')} ₺</td>
                    </tr>
                  ))}
                  <tr className="table-active">
                    <td colSpan="3" className="text-end"><strong>Genel Toplam:</strong></td>
                    <td><strong>{selectedOrder.total.toLocaleString('tr-TR')} ₺</strong></td>
                  </tr>
                </tbody>
              </table>

              {selectedOrder.notlar && (
                <>
                  <h6>Notlar</h6>
                  <p className="mb-0">{selectedOrder.notlar}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Kapat
          </Button>
          {selectedOrder && (
            <Form.Select
              style={{ width: '200px' }}
              value={selectedOrder.status}
              onChange={(e) => {
                handleStatusUpdate(selectedOrder.id, e.target.value);
                setSelectedOrder({ ...selectedOrder, status: e.target.value });
              }}
            >
              {durumSecenekleri.map(status => (
                <option key={status} value={status}>
                  {durumCevirileri[status]}
                </option>
              ))}
            </Form.Select>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderManagement;
