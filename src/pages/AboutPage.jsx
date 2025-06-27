import React from 'react';
import { Award, Users, Globe, Heart } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>Sobre Nathurala</h1>
          <p className="about-hero-text">
            Más que una tienda, somos curadores de experiencias sensoriales únicas
          </p>
        </div>

        <div className="about-content">
          <section className="about-story">
            <h2>Nuestra Historia</h2>
            <p>
              Fundada en 2020, Nathurala nació de la pasión por los aromas y la búsqueda 
              constante de fragancias excepcionales. Comenzamos como un pequeño proyecto 
              familiar y hemos crecido hasta convertirnos en el destino preferido para 
              amantes de los aromas premium.
            </p>
            <p>
              Cada fragancia en nuestra colección es cuidadosamente seleccionada por 
              nuestros expertos perfumistas, quienes viajan por todo el mundo en busca 
              de los ingredientes más puros y las esencias más extraordinarias.
            </p>
          </section>

          <section className="about-values">
            <h2>Nuestros Valores</h2>
            <div className="values-grid">
              <div className="value-card">
                <Award className="value-icon" />
                <h3>Calidad Premium</h3>
                <p>Solo trabajamos con los mejores productores y utilizamos ingredientes de máxima calidad.</p>
              </div>
              <div className="value-card">
                <Users className="value-icon" />
                <h3>Experiencia Personal</h3>
                <p>Cada cliente recibe atención personalizada para encontrar su aroma perfecto.</p>
              </div>
              <div className="value-card">
                <Globe className="value-icon" />
                <h3>Sostenibilidad</h3>
                <p>Comprometidos con prácticas sostenibles y el cuidado del medio ambiente.</p>
              </div>
              <div className="value-card">
                <Heart className="value-icon" />
                <h3>Pasión</h3>
                <p>Cada fragancia cuenta una historia y despierta emociones únicas.</p>
              </div>
            </div>
          </section>

          <section className="about-mission">
            <h2>Nuestra Misión</h2>
            <p>
              Transformar espacios y crear momentos inolvidables a través del poder 
              de los aromas. Creemos que una fragancia puede cambiar completamente 
              la atmósfera de un lugar y el estado de ánimo de las personas.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;