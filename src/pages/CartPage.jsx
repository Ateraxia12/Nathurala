import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, UserCircle, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price) => {
    const numericPrice = parseFloat(price);
    return isNaN(numericPrice) ? 0 : numericPrice;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const itemPrice = formatPrice(item.precio);
      const quantity = parseInt(item.quantity) || 0;
      return total + (itemPrice * quantity);
    }, 0);
  };

  // Mostrar mensaje de autenticación si no está logueado
  if (!isAuthenticated()) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="auth-required">
            <UserCircle className="auth-required-icon" />
            <h2>Inicia sesión para ver tu carrito</h2>
            <p>Para continuar con tu compra y gestionar tu carrito, necesitas tener una cuenta en Nathurala</p>
            
            <div className="auth-required-actions">
              <Link to="/login" className="btn-primary">
                <LogIn className="btn-icon" />
                Iniciar Sesión
              </Link>
              <Link to="/registro" className="btn-secondary">
                <UserCircle className="btn-icon" />
                Crear Cuenta
              </Link>
            </div>
            
            <div className="auth-required-benefits">
              <h3>¿Por qué crear una cuenta?</h3>
              <ul>
                <li>✓ Guarda tus productos favoritos</li>
                <li>✓ Historial de compras</li>
                <li>✓ Ofertas exclusivas</li>
                <li>✓ Proceso de compra más rápido</li>
              </ul>
            </div>

            <Link to="/" className="continue-shopping">
              ← Continuar explorando productos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag className="empty-cart-icon" />
            <h2>Tu carrito está vacío</h2>
            <p>Descubre nuestros increíbles aromas y encuentra tu fragancia perfecta</p>
            <Link to="/" className="btn-primary">Explorar productos</Link>
          </div>
        </div>
      </div>
    );
  }

  const total = calculateTotal();

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
          <button onClick={clearCart} className="clear-cart-btn">Vaciar carrito</button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => {
              const itemPrice = formatPrice(item.precio);
              const quantity = parseInt(item.quantity) || 0;
              const subtotal = itemPrice * quantity;

              return (
                <div key={item.id} className="cart-item">
                  <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3>{item.nombre}</h3>
                    <p>{item.categoria}</p>
                    <div>COP {itemPrice.toLocaleString()}</div>
                  </div>

                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.id, Math.max(quantity - 1, 1))}><Minus /></button>
                    <span>{quantity}</span>
                    <button onClick={() => updateQuantity(item.id, quantity + 1)}><Plus /></button>
                    <button onClick={() => removeFromCart(item.id)}><Trash2 /></button>
                  </div>

                  <div className="cart-item-total">
                    COP {subtotal.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del pedido</h3>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>COP {total.toLocaleString()}</span>
              </div>

              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div className="summary-line total">
                <span>Total</span>
                <span>COP {total.toLocaleString()}</span>
              </div>

              <button onClick={() => navigate('/checkout')} className="auth-button">
                Proceder al pago
              </button>

              <Link to="/" className="continue-shopping">Continuar comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
