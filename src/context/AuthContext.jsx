import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTabSync } from '../hooks/useTabSync';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:3000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Función para obtener datos del usuario desde localStorage
  const getUserFromStorage = useCallback(() => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        return {
          ...JSON.parse(userData),
          token
        };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }, []);

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('authState');
    setUser(null);
  }, []);

  // Función para guardar datos de autenticación
  const saveAuthData = useCallback((userData, token) => {
    const authData = {
      ...userData,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(authData));
    localStorage.setItem('authState', 'authenticated');
    
    setUser({ ...authData, token });

    // Notificar a otras pestañas
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'authState',
      newValue: 'authenticated',
      url: window.location.href
    }));
  }, []);

  // Función para verificar token con el backend
  const verifyTokenWithBackend = useCallback(async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        return { valid: true, userData };
      } else {
        return { valid: false, error: 'Token inválido' };
      }
    } catch (error) {
      console.error('Error verificando token:', error);
      return { valid: false, error: 'Error de conexión' };
    }
  }, []);

  // Función para refrescar token
  const refreshToken = useCallback(async (currentToken) => {
    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.refreshed) {
          saveAuthData(data.user, data.token);
          console.log('Token refrescado exitosamente');
        }
        return { success: true, data };
      } else {
        return { success: false, error: 'No se pudo refrescar el token' };
      }
    } catch (error) {
      console.error('Error refrescando token:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }, [saveAuthData]);

  // Función para sincronizar el estado con localStorage
  const syncAuthState = useCallback(async () => {
    const storedUser = getUserFromStorage();
    
    if (storedUser && storedUser.token) {
      // Verificar token con el backend
      const verification = await verifyTokenWithBackend(storedUser.token);
      
      if (verification.valid) {
        setUser({ ...verification.userData, token: storedUser.token });
        
        // Intentar refrescar el token si es necesario
        await refreshToken(storedUser.token);
      } else {
        console.log('Token inválido, limpiando datos de autenticación');
        clearAuthData();
      }
    } else {
      setUser(null);
    }
  }, [getUserFromStorage, verifyTokenWithBackend, refreshToken, clearAuthData]);

  // Hook personalizado para sincronización entre pestañas
  useTabSync(syncAuthState);

  // Inicializar autenticación al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      await syncAuthState();
      setIsLoading(false);
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeAuth();
    }
  }, [syncAuthState, isInitialized]);

  // Verificar token periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!user || !user.token) return;

    const interval = setInterval(async () => {
      await refreshToken(user.token);
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user, refreshToken]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        saveAuthData(data.user, data.token);
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }, [saveAuthData]);

  const logout = useCallback(async () => {
    try {
      if (user && user.token) {
        // Notificar al backend (opcional)
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      clearAuthData();
      
      // Notificar a otras pestañas
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'authState',
        newValue: 'unauthenticated',
        url: window.location.href
      }));
    }
  }, [user, clearAuthData]);

  const isAuthenticated = useCallback(() => {
    return !!user && !!user.token;
  }, [user]);

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated,
    syncAuthState,
    refreshToken: () => user?.token ? refreshToken(user.token) : Promise.resolve()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};