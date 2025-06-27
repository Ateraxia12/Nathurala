import React from 'react';
import { Sparkles, Mail, Phone, MapPin, } from 'lucide-react';
import { VenetianMask } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <Sparkles className="footer-logo-icon" />
              {/* <VenetianMask  className="footer-logo-icon" /> */}
              <span className="footer-logo-text">Nathurala</span>
            </div>
            <p className="footer-description">
              Tu destino premium para los mejores aromas del mundo. 
              Creamos experiencias sensoriales únicas que transforman tu espacio.
            </p>
          </div>

          <div className="footer-links">
            <h3>Enlaces Rápidos</h3>
            <ul>
              <li><a href="/">Catálogo</a></li>
              <li><a href="/nosotros">Nosotros</a></li>
              <li><a href="/carrito">Carrito</a></li>
            </ul>
          </div>

          <div className="footer-contact">
            <h3>Contacto</h3>
            <div className="contact-item">
              <Mail className="contact-icon" />
              <span>hola@Nathurala.com</span>
            </div>
            <div className="contact-item">
              <Phone className="contact-icon" />
              <span>+57 311 5696002</span>
            </div>
            <div className="contact-item">
              <MapPin className="contact-icon" />
              <span>Colombia, Quindío</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Nathurala. Todos los derechos reservados.</p>
          <p>&copy; Desarrollador Stiven Parra.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;