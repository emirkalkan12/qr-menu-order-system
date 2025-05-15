import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, Toast } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState(null);

  const [recentOrders] = useState([
    {
      id: '#001',
      masa: 'Masa 1',
      items: [
        { name: 'Klasik Burger', quantity: 2, price: 120 },
        { name: 'Kola', quantity: 2, price: 25 }
      ],
      status: 'tamamlandı',
      time: '14:30',
      total: 290
    },
    {
      id: '#002',
      masa: 'Masa 4',
      items: [
        { name: 'Sezar Salata', quantity: 1, price: 85 },
        { name: 'Soğuk Çay', quantity: 1, price: 30 }
      ],
      status: 'bekliyor',
      time: '14:45',
      total: 115
    }
  ]);

  const [populerUrunler] = useState([
    { name: 'Klasik Burger', siparis: 64, gelir: 7680 },
    { name: 'Sezar Salata', siparis: 52, gelir: 4420 },
    { name: 'Margherita Pizza', siparis: 45, gelir: 4725 },
    { name: 'Soğuk Çay', siparis: 38, gelir: 1140 }
  ]);

  const [stats] = useState({
    toplamSiparis: 24,
    toplamGelir: 4350.00,
    ortSiparisDegeri: 181.25,
    tamamlanmaOrani: 92,
    aktifMasa: 6,
    bekleyenSiparis: 3,
    enYogunSaat: '19:00-20:00'
  });

  useEffect(() => {
    // Simüle edilen bildirimler
    const notificationTimer = setInterval(() => {
      const notifications = [
        { title: 'Yeni Sipariş', body: 'Masa 3\'ten yeni sipariş geldi', type: 'success' },
        { title: 'Sipariş Hazır', body: 'Masa 1\'in siparişi hazır', type: 'info' },
        { title: 'Ödeme Alındı', body: 'Masa 2\'den ödeme alındı', type: 'primary' }
      ];
      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotification);
      setShowNotification(true);
    }, 15000); // Her 15 saniyede bir bildirim

    return () => clearInterval(notificationTimer);
  }, []);

  const getDurumRozeti = (status) => {
    const variants = {
      tamamlandı: 'success',
      bekliyor: 'warning',
      hazırlanıyor: 'primary',
      iptal: 'danger'
    };
    return (
      <Badge bg={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="position-relative">
      {/* Bildirimler */}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}>
        <Toast 
          show={showNotification} 
          onClose={() => setShowNotification(false)}
          delay={3000}
          autohide
          bg={notification?.type}
          className="text-white"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">{notification?.title}</strong>
            <small>Şimdi</small>
          </Toast.Header>
          <Toast.Body>{notification?.body}</Toast.Body>
        </Toast>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Yönetim Paneli</h2>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary"
            onClick={() => navigate('/tables')}
          >
            <i className="bi bi-table me-2"></i>
            Masa Yönetimi
          </Button>
          <Button variant="outline-secondary">
            <i className="bi bi-arrow-clockwise me-2"></i>
            Yenile
          </Button>
        </div>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-muted h6">Bugünkü Siparişler</Card.Title>
              <div className="mt-auto">
                <h3 className="mb-0 text-primary">{stats.toplamSiparis}</h3>
                <small className="text-success">↑ Dünden %12 fazla</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-muted h6">Toplam Gelir</Card.Title>
              <div className="mt-auto">
                <h3 className="mb-0 text-success">{stats.toplamGelir.toLocaleString('tr-TR')} ₺</h3>
                <small className="text-success">↑ Dünden %8 fazla</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-muted h6">Aktif Masalar</Card.Title>
              <div className="mt-auto">
                <h3 className="mb-0 text-warning">{stats.aktifMasa}</h3>
                <small className="text-muted">Toplam Kapasite: 12</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm h-100">
            <Card.Body className="d-flex flex-column">
              <Card.Title className="text-muted h6">Bekleyen Siparişler</Card.Title>
              <div className="mt-auto">
                <h3 className="mb-0 text-danger">{stats.bekleyenSiparis}</h3>
                <small className="text-danger">Acil İşlem Gerekiyor</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Günlük İstatistikler</Card.Title>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Ortalama Sipariş Değeri:</span>
                  <span className="fw-bold">{stats.ortSiparisDegeri.toLocaleString('tr-TR')} ₺</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tamamlanma Oranı:</span>
                  <span className="fw-bold">%{stats.tamamlanmaOrani}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">En Yoğun Saat:</span>
                  <span className="fw-bold">{stats.enYogunSaat}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>Son Siparişler</Card.Title>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/orders')}
                >
                  Tüm Siparişleri Gör
                </Button>
              </div>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Sipariş No</th>
                      <th>Masa</th>
                      <th>Ürünler</th>
                      <th>Toplam</th>
                      <th>Saat</th>
                      <th>Durum</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="align-middle">
                        <td>{order.id}</td>
                        <td>{order.masa}</td>
                        <td>
                          <ul className="list-unstyled mb-0">
                            {order.items.map((item, idx) => (
                              <li key={idx}>{item.quantity}x {item.name}</li>
                            ))}
                          </ul>
                        </td>
                        <td>{order.total.toLocaleString('tr-TR')} ₺</td>
                        <td>{order.time}</td>
                        <td>{getDurumRozeti(order.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>Popüler Ürünler</Card.Title>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => navigate('/menu')}
                >
                  Menüyü Yönet
                </Button>
              </div>
              <div className="table-responsive">
                <Table>
                  <thead>
                    <tr>
                      <th>Ürün</th>
                      <th>Sipariş</th>
                      <th>Gelir</th>
                      <th>Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {populerUrunler.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.siparis}</td>
                        <td>{item.gelir.toLocaleString('tr-TR')} ₺</td>
                        <td>
                          <Badge bg="success">↑ %5</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Hızlı İşlemler</Card.Title>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/tables')}
                >
                  <i className="bi bi-qr-code"></i>
                  Masa QR Kodları
                </Button>
                <Button 
                  variant="outline-success"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/tables')}
                >
                  <i className="bi bi-table"></i>
                  Aktif Masaları Görüntüle
                </Button>
                <Button 
                  variant="outline-info"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/menu')}
                >
                  <i className="bi bi-card-list"></i>
                  Menüyü Düzenle
                </Button>
                <Button 
                  variant="outline-warning"
                  className="d-flex align-items-center justify-content-center gap-2"
                  onClick={() => navigate('/orders')}
                >
                  <i className="bi bi-clock-history"></i>
                  Bekleyen Siparişler
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
