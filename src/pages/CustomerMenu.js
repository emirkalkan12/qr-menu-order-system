import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Modal, Spinner, Alert } from 'react-bootstrap';
import { menuService } from '../services/menuService';
import { orderService } from '../services/orderService';
import './CustomerMenu.css';

const CustomerMenu = () => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const location = useLocation();
  const tableNumber = new URLSearchParams(location.search).get('table');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const menuData = await menuService.getAllItems();
        const categoriesData = await menuService.getCategories();
        setMenu(menuData);
        setCategories(categoriesData);
      } catch (error) {
        setError('Menü yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        console.error('Veri yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(itemId);
    } else {
      setCart(cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const submitOrder = async () => {
    if (cart.length === 0) {
      setError('Sepetiniz boş!');
      return;
    }

    if (calculateTotal() < 10) {
      setError('Minimum sipariş tutarı 10₺ olmalıdır.');
      return;
    }

    setOrderSubmitting(true);
    setError(null);

    const order = {
      tableNumber: parseInt(tableNumber),
      items: cart.map(item => ({
        menuItemId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      status: "beklemede",
      totalAmount: calculateTotal()
    };

    try {
      await orderService.createOrder(order);
      setCart([]);
      setShowOrderModal(false);
      alert('Siparişiniz başarıyla alındı!');
    } catch (error) {
      setError('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
      console.error('Sipariş gönderilirken hata oluştu:', error);
    } finally {
      setOrderSubmitting(false);
    }
  };

  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.categoryId === selectedCategory.id)
    : menu;

  if (!tableNumber) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          <Alert.Heading>Hata!</Alert.Heading>
          <p>Geçersiz masa numarası!</p>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </Spinner>
        <p className="mt-3">Menü yükleniyor...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="customer-menu-container">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <h2 className="mb-4 text-center">Masa {tableNumber} - Menü</h2>
      
      {/* Kategoriler */}
      <div className="categories-wrapper mb-4">
        <div className="categories-scroll">
          <Button 
            variant={selectedCategory === null ? "primary" : "outline-primary"}
            className="category-btn"
            onClick={() => setSelectedCategory(null)}
          >
            Tümü
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory?.id === category.id ? "primary" : "outline-primary"}
              className="category-btn"
              onClick={() => setSelectedCategory(category)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      <Row className="g-4">
        {/* Menü Listesi */}
        <Col lg={8} md={7}>
          <Row className="g-4">
            {filteredMenu.length === 0 ? (
              <Col xs={12} className="text-center text-muted py-5">
                <span>Bu kategoride ürün bulunmamaktadır.</span>
              </Col>
            ) : (
              filteredMenu.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={6} lg={4}>
                  <Card className="h-100 menu-item-card">
                    <div className="menu-item-image-wrapper">
                      <Card.Img variant="top" src={item.image} alt={item.name} />
                      {!item.isAvailable && (
                        <div className="unavailable-overlay">
                          <span>Mevcut Değil</span>
                        </div>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5">{item.name}</Card.Title>
                      <Card.Text className="flex-grow-1">{item.description}</Card.Text>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <h5 className="mb-0">{item.price} ₺</h5>
                        <Button 
                          variant="primary" 
                          onClick={() => addToCart(item)}
                          disabled={!item.isAvailable}
                          size="sm"
                        >
                          {item.isAvailable ? 'Sepete Ekle' : 'Mevcut Değil'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>

        {/* Sepet */}
        <Col lg={4} md={5}>
          <Card className="cart-card">
            <Card.Header>
              <h4 className="mb-0">Sepetiniz - Masa {tableNumber}</h4>
            </Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <p className="text-center text-muted">Sepetiniz boş</p>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-info">
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">{item.price} ₺</small>
                        </div>
                        <div className="cart-item-quantity">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <hr />
                  <div className="cart-total">
                    <h5 className="mb-0">Toplam</h5>
                    <h5 className="mb-0">{calculateTotal()} ₺</h5>
                  </div>
                  <Button
                    variant="success"
                    className="w-100 mt-3"
                    onClick={() => setShowOrderModal(true)}
                    disabled={cart.length === 0}
                  >
                    Siparişi Gönder
                  </Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sipariş Onay Modalı */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Siparişi Onayla</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Siparişinizi onaylamak istiyor musunuz?</p>
          <div className="mb-3">
            <strong>Toplam Tutar:</strong> {calculateTotal()} ₺
          </div>
          <div className="mb-3">
            <strong>Sipariş Özeti:</strong>
            <ul className="list-unstyled mt-2">
              {cart.map(item => (
                <li key={item.id}>
                  {item.name} x {item.quantity} = {item.price * item.quantity} ₺
                </li>
              ))}
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            İptal
          </Button>
          <Button 
            variant="success" 
            onClick={submitOrder}
            disabled={orderSubmitting}
          >
            {orderSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Gönderiliyor...
              </>
            ) : (
              'Onayla ve Gönder'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CustomerMenu;
