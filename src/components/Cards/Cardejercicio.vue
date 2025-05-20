<template>
  <div class="cardejercicio">
    <h2>Recomendaciones de Ejercicios</h2>

    <!-- Mostrar un mensaje si no hay diagnóstico disponible -->
    <div v-if="diagnosis === ''" class="no-diagnosis">
      <p>No se ha detectado ningún diagnóstico. Primero, realiza un análisis de postura.</p>
    </div>

    <!-- Mostrar recomendaciones de ejercicios según el diagnóstico -->
    <div v-else>
      <div v-if="diagnosis.includes('Hombros desalineados')" class="exercise-card">
        <h3>Ejercicios para corregir hombros desalineados:</h3>
        <ul>
          <li>Ejercicio 1: Estiramiento de hombros con banda elástica</li>
          <li>Ejercicio 2: Rotaciones de hombros hacia atrás</li>
          <li>Ejercicio 3: Estiramiento del pectoral</li>
        </ul>
        <img :src="getImage('shoulder stretch')" alt="Estiramiento de hombros" />
      </div>

      <!-- Otros diagnósticos y ejercicios... -->

    </div>
  </div>
</template>

<script>
export default {
  name: 'Cardejercicio',
  data() {
    return {
      // Recuperamos el diagnóstico desde localStorage
      diagnosis: JSON.parse(localStorage.getItem('diagnostics'))?.slice(-1)?.[0]?.diagnosis || '',
      unsplashApiKey: 'hbQHWCBnQS6gf4XeSKAHZo6MGyFQ2APEB3Hq6VKRWPU',  // Tu Access Key de Unsplash
    };
  },
  methods: {
    // Método para obtener la imagen relacionada con un ejercicio
    async getImage(query) {
      const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${this.unsplashApiKey}`;

      try {
        const response = await fetch(url);

        // Verificar si la respuesta es exitosa (status 200)
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error en la API de Unsplash: ${response.status} - ${errorData.errors || response.statusText}`);
        }

        const data = await response.json();
        console.log('Respuesta de Unsplash:', data); // Verifica la respuesta completa de Unsplash

        // Verificar si los resultados existen y tienen contenido
        if (data.results && data.results.length > 0) {
          console.log('Imagen encontrada:', data.results[0].urls.small); // Log de la imagen encontrada
          return data.results[0].urls.small; // Regresamos la URL de la primera imagen encontrada
        } else {
          console.log('No se encontraron imágenes para la búsqueda: ' + query);
          return ''; // Si no se encuentra imagen, retornamos una cadena vacía
        }
      } catch (error) {
        // Mostrar el error detallado en la consola
        console.error('Error al obtener imagen de Unsplash:', error);
        return ''; // Retornamos una cadena vacía en caso de error
      }
    },
  },
};
</script>

<style scoped>
.cardejercicio {
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

.exercise-card {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.exercise-card h3 {
  font-size: 20px;
  color: #333;
}

.exercise-card ul {
  list-style-type: none;
  padding-left: 0;
}

.exercise-card li {
  font-size: 16px;
  color: #555;
  margin-bottom: 10px;
}

.exercise-card img {
  margin-top: 10px;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.exercise-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
}
</style>
