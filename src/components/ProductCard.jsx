import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated()) {
      // Redirigir al login si no está autenticado
      navigate('/login');
      return;
    }
    
    addToCart(product);
  };

  if (viewMode === 'list') {
    return (
      <div className="product-card list-card">
        <Link to={`/producto/${product.id}`} className="product-link list-link">
          <div className="product-image-container list-image">
            <img 
              src={product.imagen} 
              alt={product.nombre}
              className="product-image"
            />
            <div className="product-category">{product.categoria}</div>
          </div>
          
          <div className="product-info list-info">
            <h3 className="product-name">{product.nombre}</h3>
            <p className="product-description">{product.descripcion}</p>
            
            <div className="product-details">
              <div className="product-rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star-icon filled" />
                ))}
                <span className="rating-text">4.8 (127)</span>
              </div>
              <div className="product-intensity">
                Intensidad: <span>{product.intensidad}</span>
              </div>
            </div>
          </div>

          <div className="product-actions list-actions">
            <div className="product-price">€{product.precio}</div>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="cart-icon-small" />
              Añadir
            </button>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className={`product-card ${viewMode === 'list' ? 'list-card' : ''}`}>
      <Link 
        to={`/producto/${product.id}`} 
        className={viewMode === 'list' ? 'list-link' : 'product-link'}
      >
        <img 
          src={product.imagen} 
          alt={product.nombre}
          className={`product-image ${viewMode === 'list' ? 'list-image' : ''}`}
        />
        <div className={`product-info ${viewMode === 'list' ? 'list-info' : ''}`}>
          <h3 className="product-name">{product.nombre}</h3>
          <p className="product-description">{product.descripcion}</p>
          
          <div className="product-details">
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="star-icon filled" />
              ))}
              <span className="rating-text">(4.8)</span>
            </div>
            <p className="product-intensity">
              Intensidad: <span>{product.intensidad}</span>
            </p>
          </div>

          <div className={`product-footer ${viewMode === 'list' ? 'list-actions' : ''}`}>
            <span className="product-price">COP {product.precio}</span>
            <button 
              onClick={handleAddToCart} 
              className="add-to-cart-btn"
              title={!isAuthenticated() ? "Inicia sesión para añadir al carrito" : "Añadir al carrito"}
            >
              {!isAuthenticated() ? (
                <>
                  <UserCircle className="cart-icon-small" />
                  Iniciar sesión
                </>
              ) : (
                <>
                  <ShoppingCart className="cart-icon-small" />
                  Añadir
                </>
              )}
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;