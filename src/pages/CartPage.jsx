import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');

  const handleConfirmOrder = () => {
    if (!nombre || !telefono || !ciudad) {
      alert('Por favor completa todos los campos antes de confirmar el pedido.');
      return;
    }

    const cartDetails = cart.map(item => {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = parseInt(item.quantity) || 0;
      const subtotal = precio * cantidad;
      return `🔹 *${item.nombre}* (x${cantidad}) - COP ${subtotal.toLocaleString()}`;
    }).join('\n');

    const total = (parseFloat(getTotalPrice()) || 0).toLocaleString();

    const message = `
🛒 *Nuevo Pedido*

👤 *Nombre:* ${nombre}
📞 *Teléfono:* ${telefono}
🏙️ *Ciudad:* ${ciudad}

${cartDetails}

💵 *Total a pagar:* COP ${total}
🚚 *Método de pago:* Contra Entrega

¡Gracias por tu compra! 😊
    `;

    const phoneNumber = '573104710120';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

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

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Tu Carrito</h1>
          <button onClick={clearCart} className="clear-cart-btn">Vaciar carrito</button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.imagen} alt={item.nombre} className="cart-item-image" />
                <div className="cart-item-info">
                  <h3>{item.nombre}</h3>
                  <p>{item.categoria}</p>
                  <div>COP {parseFloat(item.precio).toLocaleString()}</div>
                </div>

                <div className="cart-item-controls">
                  <button onClick={() => updateQuantity(item.id, Math.max(item.quantity - 1, 1))}><Minus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus /></button>
                  <button onClick={() => removeFromCart(item.id)}><Trash2 /></button>
                </div>

                <div className="cart-item-total">
                  COP {(parseFloat(item.precio) * parseInt(item.quantity)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Resumen del pedido</h3>

              <div className="summary-line">
                <span>Subtotal</span>
                <span>COP {(parseFloat(getTotalPrice()) || 0).toLocaleString()}</span>
              </div>

              <div className="summary-line">
                <span>Envío</span>
                <span>Gratis</span>
              </div>

              <div className="summary-line total">
                <span>Total</span>
                <span>COP {(parseFloat(getTotalPrice()) || 0).toLocaleString()}</span>
              </div>

              <input
                type="text"
                placeholder="Ingresa tu nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ingresa tu teléfono"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
              />
              <input
                type="text"
                placeholder="Ingresa tu ciudad"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
              />

              <button onClick={handleConfirmOrder} className="checkout-btn">
                Confirmar pedido por WhatsApp
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
