
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { menuService } from '../services/menuService';
import axios from 'axios';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [menuData, categoriesData] = await Promise.all([
        menuService.getAllItems(),
        menuService.getCategories()
      ]);
      setMenuItems(menuData);
      setCategories(categoriesData);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Veriler yüklenirken bir hata oluştu!',
        variant: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('file', file);
      // .NET API adresini güncelleyin!
      const res = await axios.post('http://localhost:5220/api/image/upload', formDataImg, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, image: res.data.url }));
      setImageFile(file);
    } catch (err) {
      setAlert({ show: true, message: 'Görsel yüklenemedi!', variant: 'danger' });
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async () => {
    if (!formData.name || !formData.price) {
      setAlert({
        show: true,
        message: 'Lütfen gerekli alanları doldurun!',
        variant: 'danger'
      });
      return;
    }

    try {
      const newItem = {
        ...formData,
        price: parseFloat(formData.price),
        isAvailable: true
      };

      await menuService.createItem(newItem);
      await fetchData();
      
      setFormData({
        name: '',
        category: categories[0]?.name || '',
        price: '',
        description: '',
        image: ''
      });
      setShowAddModal(false);
      setAlert({
        show: true,
        message: 'Ürün başarıyla eklendi!',
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Ürün eklenirken bir hata oluştu!',
        variant: 'danger'
      });
    }
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setFormData(item);
    setShowEditModal(true);
  };

  const handleUpdateItem = async () => {
    if (!formData.name || !formData.price) {
      setAlert({
        show: true,
        message: 'Lütfen gerekli alanları doldurun!',
        variant: 'danger'
      });
      return;
    }

    try {
      const updatedItem = {
        ...formData,
        price: parseFloat(formData.price)
      };

      await menuService.updateItem(selectedItem.id, updatedItem);
      await fetchData();
      
      setShowEditModal(false);
      setAlert({
        show: true,
        message: 'Ürün başarıyla güncellendi!',
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Ürün güncellenirken bir hata oluştu!',
        variant: 'danger'
      });
    }
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        await menuService.deleteItem(id);
        await fetchData();
        setAlert({
          show: true,
          message: 'Ürün başarıyla silindi!',
          variant: 'success'
        });
      } catch (error) {
        setAlert({
          show: true,
          message: 'Ürün silinirken bir hata oluştu!',
          variant: 'danger'
        });
      }
    }
  };

  const filteredItems = selectedCategory === 'Tümü' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return <div className="text-center py-5">Yükleniyor...</div>;
  }

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
        <h2>Menü Yönetimi</h2>
        <Button 
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <i className="bi bi-plus-circle"></i>
          Yeni Ürün Ekle
        </Button>
      </div>

      <Row>
        <Col md={3}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Card.Title className="mb-3">Kategoriler</Card.Title>
              <div className="d-grid gap-2">
                <Button
                  key="all"
                  variant={selectedCategory === 'Tümü' ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCategory('Tümü')}
                >
                  Tüm Ürünler
                </Button>
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          <Row>
            {filteredItems.map((item) => (
              <Col key={item.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={item.image} 
                    alt={item.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.category}
                    </Card.Subtitle>
                    <Card.Text className="flex-grow-1">
                      {item.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0 text-primary">{item.price.toLocaleString('tr-TR')} ₺</h5>
                      <div>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditItem(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Ürün Ekleme Modalı */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni Ürün Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ürün Adı*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ürün adını girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fiyat (₺)*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Fiyat girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ürün açıklaması girin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Görsel Yükle</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {uploading && <Spinner animation="border" size="sm" className="ms-2" />}
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image} alt="Ürün görseli" style={{ maxWidth: 120, maxHeight: 120, borderRadius: 8 }} />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleAddItem}>
            Ürün Ekle
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Ürün Düzenleme Modalı */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ürün Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Ürün Adı*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Kategori</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Fiyat (₺)*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Görsel URL</Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            İptal
          </Button>
          <Button variant="primary" onClick={handleUpdateItem}>
            Değişiklikleri Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MenuManagement;
