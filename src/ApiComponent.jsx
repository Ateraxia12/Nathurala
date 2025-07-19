import React, { useEffect } from 'react';

const ApiComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/ejemplo');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Conexión exitosa entre frontend y backend:', result);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    fetchData();
  }, []);

  return null; // No renderizar nada en la UI
};

export default ApiComponent;