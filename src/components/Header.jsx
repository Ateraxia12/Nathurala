import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, UserCircle, LogOut, User, Settings, Users } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import logoImage from '../images/LogoNathurala.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAuthenticated, logout, user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nosotros', path: '/nosotros' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <img src={logoImage} alt="Logo Nathurala" className="logo-icon" />
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
          
          {/* Enlaces de administrador solo para móvil */}
          {isAuthenticated() && isAdmin() && (
            <div className="mobile-admin-section">
              <Link
                to="/admin"
                className={`nav-link admin-link ${isActive('/admin') ? 'nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Settings className="admin-icon" />
                Panel Admin
              </Link>
              <Link
                to="/admin/users"
                className={`nav-link admin-link ${isActive('/admin/users') ? 'nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="admin-icon" />
                Gestionar Usuarios
              </Link>
              <Link
                to="/admin/users/new"
                className={`nav-link admin-link ${isActive('/admin/users/new') ? 'nav-link-active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="admin-icon" />
                Crear Nuevo Usuario
              </Link>
            </div>
          )}
          
          {/* Botones de autenticación para móvil */}
          <div className="mobile-auth-buttons">
            {isAuthenticated() ? (
              <>
                <div className="mobile-user-info">
                  <User className="auth-icon" />
                  <span>Bienvenido, {user?.nombre_completo || user?.email?.split('@')[0]}</span>
                  {isAdmin() && <span className="admin-badge">Admin</span>}
                </div>
                <button 
                  onClick={handleLogout}
                  className="mobile-auth-link logout-btn"
                >
                  <LogOut className="auth-icon" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>

        <div className="header-actions">
          {/* Enlaces de administrador para escritorio */}
          

          {/* Botones de autenticación para escritorio */}
          <div className="auth-buttons">
            {isAuthenticated() ? (
              <>
                <div className="user-info">
                  <User className="auth-icon" />
                  <span>Hola, {user?.nombre_completo || user?.email?.split('@')[0]}</span>
                  {isAdmin() && <span className="admin-badge">Admin</span>}
                </div>
                <button 
                  onClick={handleLogout}
                  className="auth-button logout"
                >
                  <LogOut className="auth-icon" />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-button login">
                  <UserCircle className="auth-icon" />
                  <span>Iniciar Sesión</span>
                </Link>
                <Link to="/registro" className="auth-button register">
                  <span>Registrarse</span>
                </Link>
              </>
            )}
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