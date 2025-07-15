import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/auth.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');

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

  const handleConfirmOrder = () => {
    if (!nombre || !telefono || !ciudad) {
      alert('Por favor completa todos los campos antes de confirmar el pedido.');
      return;
    }

    const cartDetails = cart.map(item => {
      const precio = formatPrice(item.precio);
      const cantidad = parseInt(item.quantity) || 0;
      const subtotal = precio * cantidad;
      return `🔹 *${item.nombre}* (x${cantidad}) - COP ${subtotal.toLocaleString()}`;
    }).join('\n');

    const total = calculateTotal();

    const message = `
🛒 *Nuevo Pedido*

👤 *Nombre:* ${nombre}
📞 *Teléfono:* ${telefono}
🏙️ *Ciudad:* ${ciudad}

${cartDetails}

💵 *Total a pagar:* COP ${total.toLocaleString()}
🚚 *Método de pago:* Contra Entrega

¡Gracias por tu compra! 😊
    `;

    const phoneNumber = '573104710120';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const total = calculateTotal();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Información de Entrega</h2>
          <p>Complete los datos para finalizar su pedido</p>
        </div>

        <div className="form-summary">
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
        </div>

        <form className="auth-form">
          <div className="form-group">
            <div className="input-group">
              <User className="input-icon" />
              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="tel"
                placeholder="Número de teléfono"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <MapPin className="input-icon" />
              <input
                type="text"
                placeholder="Ciudad de entrega"
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="button" onClick={handleConfirmOrder} className="auth-button">
            Confirmar pedido por WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;