import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SessionManager = () => {
  const { syncAuthState, refreshToken, isAuthenticated } = useAuth();

  useEffect(() => {
    // Verificar la sesión cada 10 minutos
    const interval = setInterval(() => {
      if (isAuthenticated()) {
        console.log('Verificando sesión automáticamente...');
        refreshToken();
      }
    }, 10 * 60 * 1000); // 10 minutos

    // Verificar cuando la ventana recupera el foco
    const handleFocus = () => {
      console.log('Ventana enfocada, sincronizando estado...');
      syncAuthState();
    };

    // Verificar cuando la pestaña se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated()) {
        console.log('Pestaña visible, sincronizando estado...');
        syncAuthState();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncAuthState, refreshToken, isAuthenticated]);

  return null; // Este componente no renderiza nada
};

export default SessionManager;