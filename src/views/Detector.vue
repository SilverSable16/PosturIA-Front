<!-- Detector.vue -->
<template>
  <div>
    <DetectorIA @poseDetected="handlePoseDetected" />
    <div v-if="pose">
      <!-- Puedes agregar más detalles de la postura aquí -->
    </div>
  </div>
</template>

<script>
import DetectorIA from '@/components/Cards/DetectorIA.vue';


export default {
  name: 'Detector',
  components: {
    DetectorIA,
  },
  data() {
    return {
      pose: null,
    };
  },
  methods: {
    handlePoseDetected(pose) {
      // Recibir los datos de postura desde el componente DetectorIA
      this.pose = pose;
    },
  },
};
</script>

<style lang="scss">
/* Aquí puedes agregar estilos personalizados si lo deseas */
</style>
