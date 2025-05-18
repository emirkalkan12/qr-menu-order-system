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
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });  
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '', // Changed from category to categoryId
    price: '',
    description: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

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
      
      // Set default category if available
      if (categoriesData && categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0]);
        setFormData(prev => ({ ...prev, categoryId: categoriesData[0].id }));
      }
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
    if (name === 'categoryId') {
      const category = categories.find(c => c.id === value);
      setSelectedCategory(category);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    setAlert({ show: false, message: '', variant: 'success' });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append('file', file);
      // .NET API adresini güncelleyin!
      const res = await axios.post('http://localhost:5221/api/image/upload', formDataImg, {
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
    if (!formData.name || !formData.price || !formData.categoryId) {
      setAlert({
        show: true,
        message: 'Lütfen ürün adı, fiyat ve kategori alanlarını doldurun!',
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
        // Form'u sıfırla ve ilk kategoriyi seç
      setFormData({
        name: '',
        categoryId: categories[0] ? categories[0].id : '',  // İlk kategoriyi seç
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

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

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
  };

  const handleDeleteCategory = async (categoryId) => {
    // Check if category has items
    const itemsInCategory = menuItems.filter(item => item.categoryId === categoryId);
    if (itemsInCategory.length > 0) {
      if (!window.confirm(`Bu kategoride ${itemsInCategory.length} ürün bulunuyor. Kategoriyi silmek istediğinizden emin misiniz? Bu işlem kategorideki tüm ürünleri de silecektir.`)) {
        return;
      }
    } else if (!window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await menuService.deleteCategory(categoryId);
      if (selectedCategory?.id === categoryId) {
        setSelectedCategory(null);
      }
      await fetchData();
      setAlert({
        show: true,
        message: 'Kategori başarıyla silindi!',
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Kategori silinirken bir hata oluştu!',
        variant: 'danger'
      });
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategoryForEdit(category);
    setCategoryForm({
      name: category.name,
      description: category.description || ''
    });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryForm.name) {
      setAlert({
        show: true,
        message: 'Kategori adı boş olamaz!',
        variant: 'danger'
      });
      return;
    }

    try {
      if (selectedCategoryForEdit) {
        await menuService.updateCategory(selectedCategoryForEdit.id, categoryForm);
      } else {
        await menuService.createCategory(categoryForm);
      }
      setShowCategoryModal(false);
      setCategoryForm({ name: '', description: '' });
      setSelectedCategoryForEdit(null);
      await fetchData();
      setAlert({
        show: true,
        message: `Kategori başarıyla ${selectedCategoryForEdit ? 'güncellendi' : 'eklendi'}!`,
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `Kategori ${selectedCategoryForEdit ? 'güncellenirken' : 'eklenirken'} bir hata oluştu!`,
        variant: 'danger'
      });
    }
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({ ...prev, [name]: value }));
  };

  const filteredMenuItems = selectedCategory 
    ? menuItems.filter(item => item.categoryId === selectedCategory.id)
    : menuItems;

  if (isLoading) {
    return <div className="text-center py-5">Yükleniyor...</div>;
  }

  // Form component for adding/editing menu items
  const MenuItemForm = () => (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Ürün Adı</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Kategori</Form.Label>
        <Form.Select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Kategori Seçin</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Fiyat</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Açıklama</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={3}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Görsel</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        {uploading && <Spinner animation="border" size="sm" />}
      </Form.Group>
      <Button variant="primary" type="submit">
        {selectedItem ? 'Güncelle' : 'Ekle'}
      </Button>
    </Form>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId || !formData.price) {
      setAlert({
        show: true,
        message: 'Lütfen gerekli alanları doldurun!',
        variant: 'danger'
      });
      return;
    }

    try {
      if (selectedItem) {
        await menuService.updateItem(selectedItem.id, formData);
      } else {
        await menuService.createItem(formData);
      }
      
      await fetchData();
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedItem(null);
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        price: '',
        description: '',
        image: ''
      });
      
      setAlert({
        show: true,
        message: `Ürün başarıyla ${selectedItem ? 'güncellendi' : 'eklendi'}!`,
        variant: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: `Ürün ${selectedItem ? 'güncellenirken' : 'eklenirken'} bir hata oluştu!`,
        variant: 'danger'
      });
    }
  };

  const CategoryModal = () => (
    <Modal 
      show={showCategoryModal} 
      onHide={() => {
        setShowCategoryModal(false);
        setSelectedCategoryForEdit(null);
        setCategoryForm({ name: '', description: '' });
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedCategoryForEdit ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCategorySubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Kategori Adı</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={categoryForm.name}
              onChange={handleCategoryChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Açıklama</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={categoryForm.description}
              onChange={handleCategoryChange}
              rows={3}
            />
          </Form.Group>
          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={() => {
              setShowCategoryModal(false);
              setSelectedCategoryForEdit(null);
              setCategoryForm({ name: '', description: '' });
            }}>
              İptal
            </Button>
            <Button variant="primary" type="submit">
              {selectedCategoryForEdit ? 'Güncelle' : 'Kategori Ekle'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="container-fluid py-4">
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

      <Row className="mb-4">
        <Col>
          <h2>Menü Yönetimi</h2>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => setShowAddModal(true)} className="me-2">
            Yeni Ürün Ekle
          </Button>
          <Button variant="outline-primary" onClick={() => setShowCategoryModal(true)}>
            Kategori Ekle
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Kategoriler</h5>
            </Card.Header>
            <Card.Body>
              <div className="list-group">
                <button
                  className={`list-group-item list-group-item-action ${!selectedCategory ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Tüm Ürünler
                </button>
                {categories.map(category => (                  <div
                    key={category.id}
                    className={`list-group-item ${selectedCategory?.id === category.id ? 'active' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <button
                        className="btn btn-link text-start p-0 text-decoration-none flex-grow-1"
                        style={{ color: 'inherit' }}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category.name}
                        <span className="badge bg-secondary ms-2">
                          {menuItems.filter(item => item.categoryId === category.id).length}
                        </span>
                      </button>
                      <div className="btn-group ms-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category.id);
                          }}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : (
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredMenuItems.map(item => (
                <Col key={item.id}>
                  <Card>
                    {item.image && (
                      <Card.Img
                        variant="top"
                        src={item.image}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {categories.find(c => c.id === item.categoryId)?.name}
                      </Card.Subtitle>
                      <Card.Text>
                        {item.description}
                        <br />
                        <strong>{item.price.toFixed(2)} ₺</strong>
                      </Card.Text>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedItem(item);
                          setFormData({
                            name: item.name,
                            categoryId: item.categoryId,
                            price: item.price,
                            description: item.description || '',
                            image: item.image || ''
                          });
                          setShowEditModal(true);
                        }}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Sil
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>

      {/* Add Menu Item Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Yeni Ürün Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MenuItemForm />
        </Modal.Body>
      </Modal>

      {/* Edit Menu Item Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Ürünü Düzenle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MenuItemForm />
        </Modal.Body>
      </Modal>

      {/* Category Modal */}
      <CategoryModal />
    </div>
  );
};

export default MenuManagement;
