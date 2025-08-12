import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Plus, Edit, Trash2, X, Check, Image, Save, AlertCircle } from 'lucide-react';
import '../../styles/admin.css';
import '../../styles/productManagement.css';

const ProductManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
    imagen: '',
    stock: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Categorías disponibles
  const categorias = [
    'Aceites Esenciales',
    'Cremas',
    'Jabones',
    'Shampoo',
    'Velas',
    'Otros'
  ];

  useEffect(() => {
    if (isAuthenticated() && isAdmin()) {
      fetchProducts();
    }
  }, [isAuthenticated, isAdmin]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3000/api/admin/productos', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      if (files && files[0]) {
        setSelectedImage(files[0]);
        
        // Crear URL para vista previa
        const previewUrl = URL.createObjectURL(files[0]);
        setImagePreview(previewUrl);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria: '',
      imagen: '',
      stock: ''
    });
    setCurrentProduct(null);
    setSelectedImage(null);
    setImagePreview(null);
    
    // Limpiar el input de archivo
    const fileInput = document.getElementById('imagen-file');
    if (fileInput) fileInput.value = '';
  };

  const openCreateForm = () => {
    resetForm();
    setFormMode('create');
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: product.precio.toString(),
      categoria: product.categoria,
      imagen: product.imagen || '',
      stock: product.stock.toString()
    });
    setCurrentProduct(product);
    setFormMode('edit');
    setShowForm(true);
    
    // Si el producto tiene una imagen, mostrarla en la vista previa
    if (product.imagen) {
      setImagePreview(product.imagen.startsWith('http') ? 
        product.imagen : 
        `http://localhost:3000${product.imagen}`);
    } else {
      setImagePreview(null);
    }
    setSelectedImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de campos
    if (!formData.nombre.trim()) {
      setError('El nombre del producto es obligatorio');
      return;
    }
    
    if (!formData.categoria) {
      setError('Debes seleccionar una categoría');
      return;
    }
    
    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      setError('El precio debe ser mayor que cero');
      return;
    }
    
    try {
      setError(null);
      const token = localStorage.getItem('authToken');
      const url = formMode === 'create' 
        ? 'http://localhost:3000/api/admin/productos'
        : `http://localhost:3000/api/admin/productos/${currentProduct.id}`;
      
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      // Usar FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('descripcion', formData.descripcion || '');
      formDataToSend.append('precio', parseFloat(formData.precio));
      formDataToSend.append('categoria', formData.categoria);
      formDataToSend.append('stock', parseInt(formData.stock, 10) || 0);
      
      // Si hay una imagen seleccionada, añadirla
      if (selectedImage) {
        formDataToSend.append('imagen', selectedImage);
      } else if (formMode === 'edit') {
        // Si estamos editando y no hay una nueva imagen, indicar si mantener la actual
        formDataToSend.append('mantenerImagen', formData.imagen ? 'true' : 'false');
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
          // No incluir Content-Type para que el navegador establezca el boundary correcto para FormData
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al procesar la solicitud');
      }

      // Mostrar mensaje de éxito
      setSuccessMessage(formMode === 'create' 
        ? 'Producto creado exitosamente' 
        : 'Producto actualizado exitosamente');
      
      // Ocultar mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);

      // Actualizar la lista de productos
      fetchProducts();
      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/admin/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el producto');
      }

      // Actualizar la lista de productos
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  // Redireccionar si no es administrador
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  if (loading && products.length === 0) {
    return <div className="container mt-5">Cargando...</div>;
  }

  return (
    <div className="product-management-container mt-5">
      {/* Botón flotante para crear producto */}
      <button 
        className="floating-create-button"
        onClick={openCreateForm}
        title="Crear nuevo producto"
      >
        <Plus size={24} />
      </button>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Gestión de Productos</h1>
        </div>
        <div className="mt-3">
          <p className="text-white mb-0">Administra los productos de la tienda Nathurala.</p>
        </div>
      </div>

      <div className="product-help-banner">
        <div className="product-help-icon">
          <Plus size={24} />
        </div>
        <div className="product-help-text">
          <h4>¿Cómo crear un nuevo producto?</h4>
          <p>Haz clic en el botón <strong>"Nuevo Producto"</strong> que se encuentra en la parte superior derecha de la tabla de productos.</p>
        </div>
      </div>

      {error && (
        <div className="product-alert product-alert-danger">
          <AlertCircle size={20} />
          {error}
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setError(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}
      
      {successMessage && (
        <div className="product-alert product-alert-success">
          <Check size={20} />
          {successMessage}
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={() => setSuccessMessage(null)}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="card-title">Productos</h2>
            <button 
              className="btn-product-action btn-product-primary btn-create-product" 
              onClick={openCreateForm}
              style={{
                fontSize: '1.1rem',
                padding: '0.75rem 1.5rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                animation: 'pulse 2s infinite'
              }}
            >
              <Plus size={20} />
              Nuevo Producto
            </button>
          </div>

          {showForm && (
            <div className="product-form-container mb-4">
              <div className="product-form-header">
                <h3>{formMode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}</h3>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowForm(false)}
                  aria-label="Cerrar"
                ></button>
              </div>
              <div className="product-form-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="product-form-group">
                        <label htmlFor="nombre" className="product-form-label">Nombre del Producto*</label>
                        <input
                          type="text"
                          className="product-form-control"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="product-form-group">
                        <label htmlFor="categoria" className="product-form-label">Categoría*</label>
                        <select
                          className="product-form-control"
                          id="categoria"
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Seleccionar categoría</option>
                          {categorias.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="product-form-group">
                        <label htmlFor="precio" className="product-form-label">Precio*</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="product-form-control"
                            id="precio"
                            name="precio"
                            value={formData.precio}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="product-form-group">
                        <label htmlFor="stock" className="product-form-label">Stock</label>
                        <input
                          type="number"
                          min="0"
                          className="product-form-control"
                          id="stock"
                          name="stock"
                          value={formData.stock}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="product-form-group">
                    <label htmlFor="descripcion" className="product-form-label">Descripción</label>
                    <textarea
                      className="product-form-control product-form-textarea"
                      id="descripcion"
                      name="descripcion"
                      rows="3"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>

                  <div className="product-form-group">
                    <label htmlFor="imagen-file" className="product-form-label">Imagen del Producto</label>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="file"
                        className="product-form-control"
                        id="imagen-file"
                        name="imagen-file"
                        onChange={handleInputChange}
                        accept="image/*"
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        className="btn-product-action btn-upload-image" 
                        onClick={() => document.getElementById('imagen-file').click()}
                      >
                        <Image size={18} />
                        Subir Imagen
                      </button>
                    </div>
                    <small className="text-muted d-block mt-1">Formatos aceptados: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB</small>
                    
                    {imagePreview ? (
                      <div className="image-preview">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150'; }}
                        />
                      </div>
                    ) : (
                      <div className="image-preview">
                        <div className="image-preview-placeholder">
                          <Image size={24} />
                          <span className="ms-2">Sin imagen</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Mantener el campo de URL como alternativa */}
                    <label htmlFor="imagen" className="product-form-label mt-3">O usar URL de imagen</label>
                    <input
                      type="text"
                      className="product-form-control"
                      id="imagen"
                      name="imagen"
                      value={formData.imagen}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div className="product-form-footer">
                    <button 
                      type="button" 
                      className="btn-product-action btn-product-secondary" 
                      onClick={() => setShowForm(false)}
                    >
                      <X size={18} />
                      Cancelar
                    </button>
                    <button type="submit" className="btn-product-action btn-product-primary">
                      <Save size={18} />
                      {formMode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="product-alert product-alert-info">
              <AlertCircle size={20} />
              No hay productos registrados. ¡Crea el primero!
            </div>
          ) : (
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td className="product-image-cell">
                        {product.imagen ? (
                          <img 
                            src={product.imagen} 
                            alt={product.nombre} 
                            className="product-image-thumbnail" 
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50'; }}
                          />
                        ) : (
                          <div className="placeholder-image">
                            <Image size={20} />
                          </div>
                        )}
                      </td>
                      <td>{product.nombre}</td>
                      <td>{product.categoria}</td>
                      <td>${parseFloat(product.precio).toFixed(2)}</td>
                      <td>{product.stock}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn-product-action btn-product-secondary" 
                            onClick={() => openEditForm(product)}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="btn-product-action btn-product-danger" 
                            onClick={() => handleDelete(product.id)}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;