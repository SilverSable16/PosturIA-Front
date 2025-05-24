<template>
  <div class="cardiagnostico">
    <div class="header-with-button" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
      <h2>Diagnósticos por día</h2>
      <button @click="generarDiagnostico" class="btn-generate">Generar diagnóstico</button>
    </div>

    <div v-if="loading">Cargando diagnósticos...</div>
    <div v-else-if="groupedDiagnostics.length === 0">
      No se encontraron diagnósticos para el usuario.
    </div>
    <div v-else>
      <div v-for="(group, index) in groupedDiagnostics" :key="group.date" class="day-group">
        <h3>
          {{ isToday(group.date) ? 'Diagnósticos de hoy' : formatDate(group.date) }}
        </h3>
        <ul>
          <li
            v-for="(diag, i) in group.diagnostics"
            :key="diag.id"
            :class="{ highlight: diag.id === group.mostRecentId }"
          >
            <strong>{{ formatTime(diag.created_at) }}</strong> - {{ diag.current_posture }} ({{ diag.body_part }})
          </li>
        </ul>
      </div>
    </div>

    <div v-if="exercises.length > 0" class="exercises-section">
      <h3>Ejercicios recomendados para: <em>{{ mostRepeatedPosture }}</em></h3>
      <ul>
        <li v-for="exercise in exercises" :key="exercise.id" class="exercise-item">
          <strong>{{ exercise.name }}</strong> (Duración: {{ exercise.duration_minutes }} min)
          <p>{{ exercise.description }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cardiagnostico',
  data() {
    return {
      loading: true,
      groupedDiagnostics: [],
      mostRepeatedPosture: '',
      exercises: [],
    };
  },
  async mounted() {
    await this.loadDiagnostics();
  },
  methods: {
    async loadDiagnostics() {
      this.loading = true;
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.groupedDiagnostics = [];
        this.loading = false;
        return;
      }

      try {
        const response = await fetch('https://posturaainodejs.onrender.com/posture-analyses');
        const allAnalyses = await response.json();

        const userAnalyses = allAnalyses.filter(a => a.user_id === Number(userId));
        if (userAnalyses.length === 0) {
          this.groupedDiagnostics = [];
          this.loading = false;
          return;
        }

        const groupsMap = {};
        userAnalyses.forEach(diag => {
          const dateKey = diag.created_at.slice(0, 10);
          if (!groupsMap[dateKey]) groupsMap[dateKey] = [];
          groupsMap[dateKey].push(diag);
        });

        let groupsArray = Object.entries(groupsMap).map(([date, diagnostics]) => {
          diagnostics.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          const postureCount = {};
          diagnostics.forEach(d => {
            postureCount[d.current_posture] = (postureCount[d.current_posture] || 0) + 1;
          });

          let maxCount = 0;
          let mostRepeatedPosture = null;
          for (const posture in postureCount) {
            if (postureCount[posture] > maxCount) {
              maxCount = postureCount[posture];
              mostRepeatedPosture = posture;
            }
          }

          const filtered = diagnostics.filter(d => d.current_posture === mostRepeatedPosture);
          const mostRecentId = filtered.length ? filtered[0].id : null;

          return { date, diagnostics, mostRecentId, mostRepeatedPosture };
        });

        groupsArray.sort((a, b) => new Date(b.date) - new Date(a.date));

        this.groupedDiagnostics = groupsArray;
        this.loading = false;

        if (groupsArray.length > 0) {
          this.mostRepeatedPosture = groupsArray[0].mostRepeatedPosture;
        } else {
          this.mostRepeatedPosture = '';
        }
      } catch (error) {
        console.error('Error al cargar diagnósticos:', error);
        this.groupedDiagnostics = [];
        this.loading = false;
      }
    },

    async generarDiagnostico() {
      await this.loadDiagnostics();
      if (this.mostRepeatedPosture) {
        await this.guardarDiagnosticos();
        await this.loadExercises(this.mostRepeatedPosture);
      } else {
        this.exercises = [];
      }
    },

    async guardarDiagnosticos() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId || !this.mostRepeatedPosture) {
          console.warn('No hay usuario o postura para guardar');
          return;
        }

        // Aquí puedes personalizar la descripción según la postura:
        const descripcion = this.getDescripcionPorPostura(this.mostRepeatedPosture);

        // Ejemplo: duración fija o null
        const duracion = null;

        const payload = {
          user_id: Number(userId),
          name: `Diagnóstico automático: ${this.mostRepeatedPosture}`,
          description: descripcion,
          posture: this.mostRepeatedPosture,
          duration_minutes: duracion
        };

        const response = await fetch('https://posturaainodejs.onrender.com/posture-corrections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Error al guardar diagnóstico: ${response.statusText}`);
        }

        console.log('Diagnóstico guardado en postura_correction:', payload);
      } catch (error) {
        console.error('Error guardando diagnóstico:', error);
      }
    },

    getDescripcionPorPostura(postura) {
      switch(postura) {
        case 'Hombros desalineados':
          return 'Mala postura al sentarse o trabajar frente a pantallas por largos períodos.';
        case 'Cabeza caída':
          return 'Uso excesivo de dispositivos móviles o mala postura al leer o trabajar en el ordenador.';
        case 'Cabeza desviada hacia la derecha':
          return 'Rotación o inclinación lateral del cuello hacia la derecha.';
        case 'Cabeza desviada hacia la izquierda':
          return 'Rotación o inclinación lateral del cuello hacia la izquierda.';
        // Añade más casos según necesites
        default:
          return 'Descripción no especificada.';
      }
    },

    async loadExercises(posture) {
      try {
        const response = await fetch('https://posturaainodejs.onrender.com/posture-exercises');
        const allExercises = await response.json();

        this.exercises = allExercises.filter(e => e.posture === posture);
      } catch (error) {
        console.error('Error al cargar ejercicios:', error);
        this.exercises = [];
      }
    },

    isToday(dateString) {
      const givenDate = new Date(dateString);
      const today = new Date();
      return givenDate.getFullYear() === today.getFullYear() &&
             givenDate.getMonth() === today.getMonth() &&
             givenDate.getDate() === today.getDate();
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    formatTime(dateTimeString) {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
  }
};
</script>

<style scoped>
.cardiagnostico {
  padding: 20px;
  max-width: 700px;
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

.header-with-button {
  color: white;
  /* El estilo para la envoltura del título y botón ya inline, puedes ajustar aquí si quieres */
}

.btn-generate {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn-generate:hover {
  background-color: #0056b3;
}

.day-group {
  margin-bottom: 30px;
}

.day-group h3 {
  border-bottom: 2px solid #ccc;
  padding-bottom: 6px;
  margin-bottom: 10px;
  color: #555;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  padding: 8px 10px;
  margin-bottom: 6px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  color: #222;
}

/* Highlight en rojo para el diagnóstico más repetido y reciente */
li.highlight {
  background-color: #f8d7da; /* rojo claro */
  font-weight: bold;
  border-left: 5px solid #dc3545; /* rojo fuerte */
  color: #721c24;
}

.exercises-section {
  margin-top: 30px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.1);
}

.exercise-item {
  margin-bottom: 15px;
}
</style>
