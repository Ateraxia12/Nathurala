import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sparkles, UserCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const location = useLocation();

  const navigationItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <Sparkles className="logo-icon" />
          <span className="logo-text">Nathurala</span>
        </Link>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          <div className="mobile-auth-buttons">
            <Link 
              to="/login" 
              className="mobile-auth-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserCircle className="auth-icon" />
              <span>Iniciar Sesión</span>
            </Link>
            <Link 
              to="/registro" 
              className="mobile-auth-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserCircle className="auth-icon" />
              <span>Registrarse</span>
            </Link>
          </div>
        </nav>

        <div className="header-actions">
          <div className="auth-buttons">
            <Link to="/login" className="auth-button login">
              <UserCircle className="auth-icon" />
              <span>Iniciar Sesión</span>
            </Link>
            <Link to="/registro" className="auth-button register">
              <span>Registrarse</span>
            </Link>
          </div>

          <Link to="/carrito" className="cart-button">
            <ShoppingCart className="cart-icon" />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>

          <button
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;