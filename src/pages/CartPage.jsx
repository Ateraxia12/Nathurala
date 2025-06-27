import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag className="empty-cart-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Descubre nuestros increíbles aromas y encuentra tu fragancia perfecta</p>
            <Link to="/" className="btn-primary">
              Explorar productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
          <button onClick={clearCart} className="clear-cart-btn">
            Vaciar carrito
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.imagen} 
                  alt={item.nombre}
                  className="cart-item-image"
                />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.nombre}</h3>
                  <p className="cart-item-category">{item.categoria}</p>
                  <div className="cart-item-price">€{item.precio}</div>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <Minus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <Plus />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="remove-btn"
                  >
                    <Trash2 />
                  </button>
                </div>

                <div className="cart-item-total">
                  €{(item.precio * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del pedido</h3>
              
              <div className="summary-line">
                <span>Subtotal</span>
                <span>€{getTotalPrice().toFixed(2)}</span>
              </div>
              
              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              
              <div className="summary-line total">
                <span>Total</span>
                <span>€{getTotalPrice().toFixed(2)}</span>
              </div>

              <button className="checkout-btn">
                Proceder al pago
              </button>

              <Link to="/" className="continue-shopping">
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;