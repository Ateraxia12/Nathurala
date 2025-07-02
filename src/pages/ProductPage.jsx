import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Clock, Zap, Heart } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="container">
        <div className="product-not-found">
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="product-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft className="back-icon" />
          Volver
        </button>

        <div className="product-detail">
          <div className="product-image-section">
            <img 
              src={product.imagen} 
              alt={product.nombre}
              className="product-detail-image"
            />
          </div>

          <div className="product-info-section">
            <div className="product-badge">{product.categoria}</div>
            <h1 className="product-title">{product.nombre}</h1>
            
            <div className="product-rating-section">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
              </div>
              <span className="rating-score">4.8 (127 reseñas)</span>
            </div>

            <p className="product-description-full">{product.descripcion}</p>

            <div className="product-attributes">
              <div className="attribute">
                <Zap className="attribute-icon" />
                <div>
                  <span className="attribute-label">Intensidad</span>
                  <span className="attribute-value">{product.intensidad}</span>
                </div>
              </div>
              <div className="attribute">
                <Clock className="attribute-icon" />
                <div>
                  <span className="attribute-label">Duración</span>
                  <span className="attribute-value">{product.duracion}</span>
                </div>
              </div>
              <div className="attribute">
                <Zap className="attribute-icon" />
                <div>
                <span className="attribute-label">Presentacíon</span>
                <span className="attribute-value">{product.Presentación}</span>
                </div>
              </div>
            </div>

            <div className="product-notes">
              <h3>Notas aromáticas</h3>
              <div className="notes-list">
                {product.notas.map((nota, index) => (
                  <span key={index} className="note-tag">{nota}</span>
                ))}
              </div>
            </div>

            <h3>Uso:</h3>
            <p className="product-description-full">{product.Uso}</p>
            <h3>Ideal para: </h3>
            <p className="product-description-full">{product.Ideal}</p>

            <div className="product-actions">
              <div className="price-section">
                <span className="price">COP {product.precio}</span>
                <span className="price-label">Precio por unidad</span>
              </div>
              
              <div className="action-buttons">
                <button className="btn-secondary">
                  <Heart className="heart-icon" />
                  Favoritos
                </button>
                <button onClick={handleAddToCart} className="btn-primary">
                  <ShoppingCart className="cart-icon" />
                  Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;