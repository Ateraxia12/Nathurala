import { useEffect, useCallback } from 'react';

export const useTabSync = (onAuthChange) => {
  const handleStorageChange = useCallback((e) => {
    // Solo reaccionar a cambios en las claves de autenticación
    if (e.key === 'authToken' || e.key === 'userData' || e.key === 'authState') {
      console.log('Storage change detected:', e.key, e.newValue);
      onAuthChange();
    }
  }, [onAuthChange]);

  const handleVisibilityChange = useCallback(() => {
    // Cuando la pestaña se vuelve visible, verificar el estado de autenticación
    if (!document.hidden) {
      console.log('Tab became visible, refreshing auth state');
      onAuthChange();
    }
  }, [onAuthChange]);

  const handleFocus = useCallback(() => {
    // Cuando la ventana recupera el foco
    console.log('Window focused, refreshing auth state');
    onAuthChange();
  }, [onAuthChange]);

  useEffect(() => {
    // Escuchar cambios en localStorage (entre pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar cuando la pestaña se vuelve visible
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Escuchar cuando la ventana recupera el foco
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [handleStorageChange, handleVisibilityChange, handleFocus]);
};