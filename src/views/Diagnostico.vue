<template>
  <div class="tables-page">
    <!-- Aquí puedes tener otros componentes del dashboard si es necesario -->
    <Cardiagnostico />
  </div>
</template>

<script>
import Cardiagnostico from '@/components/Cards/Cardiagnostico.vue'; // Ajusta la ruta si es necesario

export default {
  name: 'TablesPage',
  components: {
    Cardiagnostico,
  },
};
</script>

<style lang="scss">
.tables-page {
  padding: 20px;
  background-color: #f4f4f4;
  /* Otros estilos específicos de la página */
}
</style>
