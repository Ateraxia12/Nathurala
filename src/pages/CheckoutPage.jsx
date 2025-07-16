import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Home } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/auth.css';

const CIUDADES_COLOMBIA = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Cúcuta', 'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué',
  'Pasto', 'Manizales', 'Neiva', 'Villavicencio', 'Armenia','Calarca',
  'Valledupar', 'Montería', 'Sincelejo', 'Popayán', 'Tunja'
].sort();

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart } = useCart();
  
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const formatPhoneNumber = (phone) => {
    const cleanNumber = phone.replace(/\D/g, '');
    return cleanNumber.startsWith('57') ? cleanNumber : `57${cleanNumber}`;
  };

  const handleConfirmOrder = () => {
    if (!nombre || !telefono || !ciudad || !direccion) {
      alert('Por favor completa todos los campos antes de confirmar el pedido.');
      return;
    }

    if (telefono.length < 10) {
      alert('Por favor ingresa un número de teléfono válido (mínimo 10 dígitos).');
      return;
    }

    setIsSubmitting(true);

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
🏠 *Dirección:* ${direccion}

${cartDetails}

💵 *Total a pagar:* COP ${total.toLocaleString()}
🚚 *Método de pago:* Contra Entrega

¡Gracias por tu compra! 😊
    `;

    const adminPhone = '573104710120';
    const url = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
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
                disabled={isSubmitting}
              />
            </div>

            <div className="input-group">
              <Phone className="input-icon" />
              <input
                type="tel"
                placeholder="Número de teléfono (10 dígitos)"
                value={telefono}
                onChange={e => setTelefono(e.target.value)}
                required
                disabled={isSubmitting}
                pattern="[0-9]*"
                minLength="10"
                maxLength="10"
              />
            </div>

            <div className="input-group">
              <MapPin className="input-icon" />
              <select
                value={ciudad}
                onChange={e => setCiudad(e.target.value)}
                required
                disabled={isSubmitting}
                className="auth-select"
              >
                <option value="">Selecciona tu ciudad</option>
                {CIUDADES_COLOMBIA.map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <Home className="input-icon" />
              <input
                type="text"
                placeholder="Dirección de residencia"
                value={direccion}
                onChange={e => setDireccion(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleConfirmOrder} 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Confirmar pedido por WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;