<template>
  <div class="welcome-container">
    <h1>{{ saludo }}, bienvenido a PosturIA</h1>
    <img src="images/zorro.png" alt="Logo Zorro" class="logo-image" />
    <p class="reminder-text">Recuerda hacer tus ejercicios y mantener una buena postura</p>
  </div>
</template>

<script>
export default {
  name: "Welcome",
  data() {
    return {
      saludo: '',
    };
  },
  mounted() {
    this.setSaludo();
  },
  methods: {
    setSaludo() {
      const hora = new Date().getHours();
      if (hora >= 6 && hora < 12) {
        this.saludo = 'Buenos días';
      } else if (hora >= 12 && hora < 19) {
        this.saludo = 'Buenas tardes';
      } else {
        this.saludo = 'Buenas noches';
      }
    }
  }
};
</script>

<style scoped lang="scss">
.welcome-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: white;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 1rem;
  box-sizing: border-box;
}

.logo-image {
  max-width: 500px;
  max-height: 500px;
  margin-top: 2rem;
  user-select: none;
}

h1 {
  font-size: 3.5rem;
  font-weight: 700;
  text-align: center;
  user-select: none;
}

.reminder-text {
  margin-top: 1.5rem;
  font-size: 1.2rem;
  color:rgb(0, 0, 0); /* rojo fuerte */
  text-align: center;
  user-select: none;
  font-weight: 700;
}
</style>
