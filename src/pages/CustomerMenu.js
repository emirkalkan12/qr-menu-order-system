import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { menuService } from '../services/menuService';
import { orderService } from '../services/orderService';

const CustomerMenu = () => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const location = useLocation();
  const tableNumber = new URLSearchParams(location.search).get('table');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuData = await menuService.getMenuItems();
        const categoriesData = await menuService.getCategories();
        setMenu(menuData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
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
      setCart([]); // Clear cart after successful order
      alert('Siparişiniz başarıyla alındı!');
    } catch (error) {
      console.error('Sipariş gönderilirken hata oluştu:', error);
      alert('Sipariş gönderilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const filteredMenu = selectedCategory
    ? menu.filter((item) => item.category === selectedCategory)
    : menu;

  if (!tableNumber) return <Container className="py-4"><h3>Geçersiz masa numarası!</h3></Container>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">Masa {tableNumber} - Menü</h2>
      
      {/* Kategoriler */}
      <div className="categories-scroll mb-4">
        <Button 
          variant={selectedCategory === null ? "primary" : "outline-primary"}
          className="me-2 mb-2"
          onClick={() => setSelectedCategory(null)}
        >
          Tümü
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.name ? "primary" : "outline-primary"}
            className="me-2 mb-2"
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <Row>
        {/* Menü Listesi */}
        <Col md={8}>
          <Row>
            {filteredMenu.map((item) => (
              <Col key={item.id} md={6} className="mb-4">
                <Card>
                  <Card.Img variant="top" src={item.image} alt={item.name} />
                  <Card.Body>
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text>{item.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5>{item.price} ₺</h5>
                      <Button 
                        variant="primary" 
                        onClick={() => addToCart(item)}
                        disabled={!item.isAvailable}
                      >
                        {item.isAvailable ? 'Sepete Ekle' : 'Mevcut Değil'}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Sepet */}
        <Col md={4}>
          <Card className="sticky-top" style={{ top: "1rem" }}>
            <Card.Header>
              <h4 className="mb-0">Sepetiniz - Masa {tableNumber}</h4>
            </Card.Header>
            <Card.Body>
              {cart.length === 0 ? (
                <p>Sepetiniz boş</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="mb-0">{item.name}</h6>
                        <small className="text-muted">{item.price} ₺</small>
                      </div>
                      <div className="d-flex align-items-center">
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
                  <hr />
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Toplam</h5>
                    <h5 className="mb-0">{calculateTotal()} ₺</h5>
                  </div>
                  <Button
                    variant="success"
                    className="w-100"
                    onClick={submitOrder}
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
    </Container>
  );
};

export default CustomerMenu;
