import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="product-card">
      <Link to={`/producto/${product.id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.imagen} 
            alt={product.nombre}
            className="product-image"
          />
          <div className="product-category">{product.categoria}</div>
        </div>
        
        <div className="product-info">
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

          <div className="product-footer">
            <div className="product-price">COP {product.precio}</div>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="cart-icon-small" />
              Añadir
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;