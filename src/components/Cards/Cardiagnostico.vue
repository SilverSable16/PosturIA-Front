<template>
  <div class="cardiagnostico">
    <h2>Último Diagnóstico</h2>

    <!-- Mostrar un mensaje si no hay diagnóstico reciente -->
    <div v-if="diagnosis === ''" class="no-diagnosis">
      <p>No se ha detectado ningún diagnóstico. Primero, realiza un análisis de postura.</p>
    </div>

    <!-- Mostrar el diagnóstico y su descripción -->
    <div v-else class="diagnostic-card">
      <p class="diagnosis">{{ diagnosis }}</p>
      <p class="description">{{ description }}</p>
      <p class="agent-response">🤖 {{ agentResponse }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cardiagnostico',
  data() {
    return {
      diagnosis: '',
      description: '',
      agentResponse: ''
    };
  },
  mounted() {
    this.loadLatestDiagnosis();
  },
  methods: {
    async loadLatestDiagnosis() {
      const storedDiagnostics = JSON.parse(localStorage.getItem('diagnostics')) || [];

      if (storedDiagnostics.length > 0) {
        const latestDiagnostic = storedDiagnostics[storedDiagnostics.length - 1];
        this.diagnosis = latestDiagnostic.diagnosis;

        switch (this.diagnosis) {
          case 'Postura incorrecta: Hombros desalineados':
            this.description = 'Causas posibles: Mala postura al sentarse o trabajar frente a pantallas por largos períodos.';
            break;
          case 'Postura incorrecta: Codos demasiado doblados':
            this.description = 'Causas posibles: Flexiones incorrectas al realizar ejercicios o uso inadecuado del teclado y ratón.';
            break;
          case 'Postura incorrecta: Rodillas demasiado separadas':
            this.description = 'Causas posibles: Desalineación al caminar o postura incorrecta al estar de pie por mucho tiempo.';
            break;
          case 'Postura incorrecta: Espalda encorvada':
            this.description = 'Causas posibles: Estar sentado durante períodos prolongados sin soporte adecuado para la espalda.';
            break;
          case 'Postura incorrecta: Cabeza demasiado adelante':
            this.description = 'Causas posibles: Uso excesivo de dispositivos móviles o mala postura al leer o trabajar en el ordenador.';
            break;
          case 'Postura correcta':
            this.description = '¡Bien hecho! Mantén una buena postura para evitar dolores a largo plazo.';
            break;
          default:
            this.description = 'Causa no especificada.';
        }

        // Llamar al backend del agente inteligente para obtener recomendación
        await this.consultarAgente(this.diagnosis);
      }
    },

    async consultarAgente(diagnostico) {
      try {
        const response = await fetch('https://posturaia.onrender.com/ia', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: diagnostico })
        });
        const data = await response.json();
        this.agentResponse = data.respuesta || 'No se obtuvo respuesta del agente.';
      } catch (error) {
        console.error('Error al consultar el agente:', error);
        this.agentResponse = 'Hubo un problema al consultar el agente.';
      }
    }
  }
};
</script>

<style scoped>
.cardiagnostico {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #f4f4f4;
  border-radius: 8px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.no-diagnosis {
  text-align: center;
  font-size: 18px;
  color: #888;
}

.diagnostic-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
}

.diagnosis {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-top: 10px;
}

.description {
  font-size: 14px;
  color: #777;
  margin-top: 5px;
}

.agent-response {
  font-size: 14px;
  color: #2a7;
  margin-top: 10px;
  font-style: italic;
}
</style>
