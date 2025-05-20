<template>
  <div class="billing-page">
    <!-- Aquí puedes tener otros componentes del dashboard si es necesario -->
    <Cardejercicio />
  </div>
</template>

<script>
// Importar el componente Cardejercicio
import Cardejercicio from '@/components/Cards/Cardejercicio.vue'; // Ajusta la ruta si es necesario

export default {
  name: 'BillingPage',
  components: {
    Cardejercicio, // Registrar el componente Cardejercicio
  },
};
</script>

<style lang="scss">
.billing-page {
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
