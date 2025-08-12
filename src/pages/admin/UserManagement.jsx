import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import '../../styles/admin.css';

const UserManagement = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [adminEmails, setAdminEmails] = useState(['admin@nathurala.com', 'admin@example.com']);
  const [showAdminEmailsModal, setShowAdminEmailsModal] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nombre_completo: '',
    email: '',
    role: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    // Cargar la lista de correos de administradores desde localStorage
    const savedAdminEmails = localStorage.getItem('adminEmails');
    if (savedAdminEmails) {
      try {
        const parsedEmails = JSON.parse(savedAdminEmails);
        if (Array.isArray(parsedEmails)) {
          setAdminEmails(parsedEmails);
        }
      } catch (error) {
        console.error('Error al cargar correos de administradores:', error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) {
          throw new Error('Error al obtener usuarios');
        }
    
        const data = await response.json();
        
        // Depuración: Mostrar datos originales recibidos del servidor
        console.log('Datos originales del servidor:', JSON.stringify(data, null, 2));
        
        // Asegurarse de que todos los usuarios tengan un rol válido y normalizar el campo rol/role
        const processedData = data.map(user => {
          // Normalizar el campo rol/role
          const userRole = user.role || user.rol || 'cliente';
          
          // Crear un nuevo objeto de usuario con campos normalizados
          const normalizedUser = {
            ...user,
            role: userRole, // Asegurarse de que siempre exista el campo 'role' para el frontend
          };
          
          // Verificar si el correo es de un administrador conocido
          if (adminEmails.includes(user.email) && userRole !== 'admin') {
            console.warn(`Corrigiendo rol para administrador ${user.email}: de ${userRole} a 'admin'`);
            normalizedUser.role = 'admin';
          }
          
          // Si el rol no es válido, asignar 'cliente' por defecto
          if (normalizedUser.role !== 'admin' && normalizedUser.role !== 'cliente' && normalizedUser.role !== 'observador') {
            console.warn(`Usuario ${user.id} (${user.email}) tiene un rol inválido: ${normalizedUser.role}. Asignando 'cliente' por defecto.`);
            normalizedUser.role = 'cliente';
          }
          
          console.log(`Usuario procesado: ID=${normalizedUser.id}, Email=${normalizedUser.email}, Role=${normalizedUser.role}`);
          return normalizedUser;
        });
        
        console.log('Usuarios procesados:', processedData);
        setUsers(processedData);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated() && isAdmin()) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin, adminEmails]);

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

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Contar usuarios por rol
  const userCounts = {
    all: users.length,
    admin: users.filter(user => user.role === 'admin').length,
    cliente: users.filter(user => user.role === 'cliente').length,
    observador: users.filter(user => user.role === 'observador').length
  };

  // Función para manejar el clic en el botón de editar
  const handleEditClick = (user) => {
    console.log('Usuario seleccionado para editar:', user);
    
    // Verificar que el usuario tenga todos los campos necesarios
    if (!user || !user.id || !user.nombre_completo || !user.email) {
      console.error('Datos de usuario incompletos:', user);
      alert('Error: Datos de usuario incompletos');
      return;
    }
    
    // Asegurarse de que el rol sea válido
    const role = user.role || user.rol || 'cliente';
    
    setCurrentUser(user);
    setEditFormData({
      nombre_completo: user.nombre_completo,
      email: user.email,
      role: role
    });
    
    console.log('Formulario de edición configurado:', {
      nombre_completo: user.nombre_completo,
      email: user.email,
      role: role
    });
    
    setShowEditModal(true);
  };

  // Función para manejar cambios en el formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  // Función para manejar el envío del formulario de edición
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      console.log('Enviando datos para actualizar usuario:', editFormData);
      
      const response = await fetch(`http://localhost:3000/api/admin/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar usuario');
      }

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);

      // Actualizar el usuario en el estado local
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          // Asegurarse de mantener todos los campos originales del usuario
          // y solo actualizar los campos que se enviaron en el formulario
          return { 
            ...user, 
            nombre_completo: editFormData.nombre_completo,
            email: editFormData.email,
            role: editFormData.role // Mantener el campo como 'role' para consistencia
          };
        }
        return user;
      });

      setUsers(updatedUsers);
      setShowEditModal(false);
      setCurrentUser(null);
      
      // Mostrar mensaje de éxito
      alert('Usuario actualizado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Funciones para manejar la eliminación de usuarios
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:3000/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar usuario');
      }

      // Eliminar el usuario del estado local
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Gestión de Usuarios</h1>
          <Link to="/admin" className="btn-back">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M0 0h24v24H0z" fill="none"/>
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Volver al Panel
          </Link>
        </div>
      </div>

      <div className="admin-controls">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </div>

        <div className="role-filter-buttons">
          <button 
            className={`role-filter-btn all ${filterRole === '' ? 'active' : ''}`}
            onClick={() => setFilterRole('')}
          >
            <span className="role-count">{userCounts.all}</span>
            <span className="role-name">Todos</span>
          </button>
          <button 
            className={`role-filter-btn admin ${filterRole === 'admin' ? 'active' : ''}`}
            onClick={() => setFilterRole('admin')}
          >
            <span className="role-count">{userCounts.admin}</span>
            <span className="role-name">Administradores</span>
          </button>
          <button 
            className={`role-filter-btn cliente ${filterRole === 'cliente' ? 'active' : ''}`}
            onClick={() => setFilterRole('cliente')}
          >
            <span className="role-count">{userCounts.cliente}</span>
            <span className="role-name">Clientes</span>
          </button>
          <button 
            className={`role-filter-btn observador ${filterRole === 'observador' ? 'active' : ''}`}
            onClick={() => setFilterRole('observador')}
          >
            <span className="role-count">{userCounts.observador}</span>
            <span className="role-name">Observadores</span>
          </button>
        </div>
        
        <button 
          className="btn btn-warning admin-emails-btn"
          onClick={() => setShowAdminEmailsModal(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
            <path d="M0 0h24v24H0z" fill="none"/>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Gestionar Correos Admin
        </button>
      </div>

      <div className="admin-table">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha Registro</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre_completo}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role === 'admin' ? 'admin' : user.role === 'observador' ? 'observador' : 'cliente'}`}>
                      {user.role === 'admin' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
                        </svg>
                      )}
                      {user.role === 'cliente' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      )}
                      {user.role === 'observador' && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                        </svg>
                      )}
                      <span className="role-badge-text">
                        {user.role === 'admin' ? 'Administrador' : 
                         user.role === 'cliente' ? 'Cliente' : 'Observador'}
                      </span>
                    </span>
                  </td>
                  <td>{new Date(user.fecha_registro).toLocaleDateString()}</td>
                  <td>{user.fecha_ultimo_acceso ? new Date(user.fecha_ultimo_acceso).toLocaleDateString() : 'Nunca'}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleEditClick(user)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                        Editar
                      </button>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteClick(user)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No se encontraron usuarios</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para gestionar correos de administradores */}
      {showAdminEmailsModal && (
        <div className="admin-emails-modal">
          <div className="admin-emails-modal-content">
            <div className="admin-emails-modal-header">
              <h3>Gestionar Correos de Administradores</h3>
              <button className="close-btn" onClick={() => setShowAdminEmailsModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="admin-emails-modal-body">
              <div className="admin-emails-list">
                <h4>Correos actuales:</h4>
                {adminEmails.map((email, index) => (
                  <div key={index} className="admin-email-item">
                    <span>{email}</span>
                    <button 
                      className="remove-email-btn" 
                      onClick={() => {
                        const updatedEmails = [...adminEmails];
                        updatedEmails.splice(index, 1);
                        setAdminEmails(updatedEmails);
                        localStorage.setItem('adminEmails', JSON.stringify(updatedEmails));
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <div className="add-admin-email">
                <h4>Agregar nuevo correo:</h4>
                <div className="add-email-form">
                  <input 
                    type="email" 
                    value={newAdminEmail} 
                    onChange={(e) => setNewAdminEmail(e.target.value)} 
                    placeholder="Correo electrónico"
                  />
                  <button 
                    className="add-email-btn" 
                    onClick={() => {
                      if (newAdminEmail && !adminEmails.includes(newAdminEmail)) {
                        const updatedEmails = [...adminEmails, newAdminEmail];
                        setAdminEmails(updatedEmails);
                        setNewAdminEmail('');
                        localStorage.setItem('adminEmails', JSON.stringify(updatedEmails));
                      }
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
            <div className="admin-emails-modal-footer">
              <button className="btn btn-primary" onClick={() => setShowAdminEmailsModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar usuario */}
      {showEditModal && currentUser && (
        <div className="edit-user-modal">
          <div className="edit-user-modal-content">
            <div className="edit-user-modal-header">
              <h3>Editar Usuario</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="edit-user-modal-body">
              <form onSubmit={handleEditFormSubmit}>
                <div className="form-group">
                  <label htmlFor="nombre_completo">Nombre Completo</label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="nombre_completo"
                      name="nombre_completo"
                      className="with-icon"
                      value={editFormData.nombre_completo}
                      onChange={handleEditFormChange}
                      placeholder="Ingrese nombre completo"
                      required
                    />
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <div className="input-wrapper">
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      className="with-icon"
                      value={editFormData.email}
                      onChange={handleEditFormChange}
                      placeholder="Ingrese correo electrónico"
                      required
                    />
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="role">Rol</label>
                  <select 
                    id="role"
                    name="role"
                    value={editFormData.role}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="admin">Administrador</option>
                    <option value="cliente">Cliente</option>
                    <option value="observador">Observador</option>
                  </select>
                </div>
                <div className="edit-user-modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar usuario */}
      {showDeleteConfirm && userToDelete && (
        <div className="delete-confirm-modal">
          <div className="delete-confirm-modal-content">
            <div className="delete-confirm-modal-header">
              <h3>Confirmar Eliminación</h3>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 0h24v24H0z" fill="none"/>
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            <div className="delete-confirm-modal-body">
              <p>¿Está seguro que desea eliminar al usuario <strong>{userToDelete.nombre_completo}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="delete-confirm-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancelar</button>
              <button className="btn btn-danger" onClick={handleDeleteConfirm}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;