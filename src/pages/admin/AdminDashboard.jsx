import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated() && isAdmin()) {
      fetchStats();
    }
  }, [isAuthenticated, isAdmin]);

  // Redireccionar si no es administrador
  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <div className="container mt-5">Cargando...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Panel de Administración</h1>
        </div>
        <div className="mt-3">
          <p className="text-white mb-0">¡Bienvenido, {user?.nombre_completo || 'Administrador'}! Tienes acceso completo al panel de administración de Nathurala.</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="admin-stats-card users">
            <div className="card-body">
              <h5 className="card-title">Usuarios</h5>
              <h2 className="card-text">{stats?.users || 0}</h2>
              <Link to="/admin/users" className="btn mt-2">Ver usuarios</Link>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="admin-stats-card products">
            <div className="card-body">
              <h5 className="card-title">Productos</h5>
              <h2 className="card-text">{stats?.products || 0}</h2>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6v-2zM7 7h2v2H7V7zm0 4h2v2H7v-2zm0 4h2v2H7v-2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="admin-stats-card orders">
            <div className="card-body">
              <h5 className="card-title">Pedidos</h5>
              <h2 className="card-text">{stats?.orders || 0}</h2>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 4c0 .55-.45 1-1 1s-1-.45-1-1V8h2v2zm3-4c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm5 12H6v-9.83l3 1.83v-1.62l-3-1.83V8h12v1.55l-3 1.83v1.62l3-1.83V18z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-3 mb-4">
          <div className="admin-stats-card revenue">
            <div className="card-body">
              <h5 className="card-title">Ingresos</h5>
              <h2 className="card-text">${stats?.revenue || 0}</h2>
              <div className="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;