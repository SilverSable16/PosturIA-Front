<template>
  <div class="welcome-container">
    <!-- Fondo -->
    <div class="background-image"></div>

    <header class="header">
      <h1>Bienvenido a <span class="highlight">PosturIA</span></h1>
      <p class="subtitle">
        Sistema inteligente para detección postural y recomendaciones personalizadas de fisioterapia.
      </p>
      <div class="btn-group">
        <router-link to="/sign-in" class="btn btn-primary">Iniciar Sesión</router-link>
        <router-link to="/sign-up" class="btn btn-secondary">Registrarme</router-link>
      </div>
    </header>

    <main class="content">
      <section>
        <h2>¿Qué es PosturIA?</h2>
        <p>
          Un sistema innovador basado en inteligencia artificial para mejorar tu postura corporal, brindando recomendaciones personalizadas dondequiera que estés.
        </p>
      </section>

      <section>
        <h2>El Problema</h2>
        <p>
          Más del 60% de los adultos en Guatemala sufren problemas musculares por malas posturas, y el acceso a fisioterapia personalizada es limitado.
        </p>
      </section>

      <section>
        <h2>Nuestra Solución</h2>
        <p>
          Utilizamos cámaras para monitorear tu postura en tiempo real, ofreciendo correcciones y seguimiento remoto por profesionales.
        </p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style scoped>
.welcome-container {
  position: relative;
  max-width: 900px;
  margin: 3rem auto 4rem;
  padding: 2rem 1rem 4rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: black;
  background: transparent;
  z-index: 1;
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-image: url('/images/fondo.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(0.7);
  z-index: -1;
}

.header {
  text-align: center;
  margin-bottom: 3rem;
  background-color: rgba(255,255,255,0.9);
  padding: 2rem 1rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

.header h1 {
  font-size: 3.75rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.header .highlight {
  font-weight: 900;
}

.subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
}

.btn-group {
  display: inline-flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 2rem;
  font-weight: 600;
  border-radius: 9999px;
  text-decoration: none;
  font-size: 1.1rem;
  cursor: pointer;
  border: 2px solid black;
  color: black;
  background-color: transparent;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.btn-primary:hover {
  background-color: black;
  color: white;
}

.btn-secondary:hover {
  background-color: black;
  color: white;
}

.content {
  background-color: rgba(255,255,255,0.9);
  padding: 2rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
}

.content section {
  margin-bottom: 2.5rem;
}

.content h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.content p {
  font-size: 1.125rem;
  line-height: 1.6;
}
</style>
