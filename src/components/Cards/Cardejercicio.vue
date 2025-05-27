<template>
  <div class="cardejercicio">
    <h2>Recomendaciones de Ejercicios</h2>

    <div v-if="loading">Cargando diagnóstico y ejercicios...</div>

    <div v-else-if="diagnosis === ''">
      <p class="no-diagnosis">
        No se ha detectado ningún diagnóstico. Primero, realiza un análisis de postura.
      </p>
    </div>

    <div v-else>
      <div class="exercise-card">
        <h3>Ejercicios para corregir: {{ diagnosis }}</h3>
        <ul>
          <li v-for="exercise in exercises" :key="exercise.id" class="exercise-item">
            <strong>{{ exercise.name }}</strong> (Duración: {{ exercise.duration_minutes || '?' }} min)
            <p>{{ exercise.description }}</p>
          </li>
        </ul>
      </div>

      <button @click="mostrarTodosEjercicios" class="btn-show-all">
        {{ showAllExercises ? 'Ocultar todos los ejercicios' : 'Mostrar todos los ejercicios' }}
      </button>

      <button @click="crearPDF" class="btn-create-pdf">
        Crear PDF
      </button>

      <div v-if="showAllExercises" class="all-exercises-section">
        <h3>Todos los ejercicios disponibles</h3>
        <ul>
          <li v-for="exercise in allExercises" :key="exercise.id" class="exercise-item">
            <strong>{{ exercise.name }}</strong> (Duración: {{ exercise.duration_minutes || '?' }} min) - <em>{{ exercise.posture }}</em>
            <p>{{ exercise.description }}</p>
          </li>
        </ul>
      </div>

      <div v-if="exerciseImageUrl" class="exercise-image" v-show="!showAllExercises">
        <!-- <img :src="exerciseImageUrl" :alt="'Imagen relacionada con ' + diagnosis" /> -->
      </div>
    </div>
  </div>
</template>

<script>

import { jsPDF } from "jspdf";
export default {
  name: 'Cardejercicio',
  data() {
    return {
      diagnosis: '',
      exercises: [],
      allExercises: [],
      showAllExercises: false,
      exerciseImageUrl: '',
      loading: false,
      unsplashApiKey: 'hbQHWCBnQS6gf4XeSKAHZo6MGyFQ2APEB3Hq6VKRWPU',
      userName: '', // Para mostrar nombre de usuario en PDF
      appLogoBase64: '', // Para el logo en base64
    };
  },
  async mounted() {
    await this.loadLatestDiagnosisAndExercises();
    await this.loadUserName();
    await this.loadAppLogo();
  },
  methods: {
    async loadLatestDiagnosisAndExercises() {
      this.loading = true;
      const userId = localStorage.getItem('userId');
      if (!userId) {
        this.diagnosis = '';
        this.exercises = [];
        this.loading = false;
        return;
      }

      try {
        const respDiag = await fetch('https://posturaainodejs.onrender.com/posture-corrections');
        const allDiagnoses = await respDiag.json();

        const userDiagnoses = allDiagnoses.filter(d => d.user_id === Number(userId));
        if (userDiagnoses.length === 0) {
          this.diagnosis = '';
          this.exercises = [];
          this.loading = false;
          return;
        }

        userDiagnoses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const latestDiagnosis = userDiagnoses[0];
        this.diagnosis = latestDiagnosis.posture;

        await this.loadExercises(this.diagnosis);

        this.exerciseImageUrl = await this.getImage(this.diagnosis);

      } catch (error) {
        console.error('Error al cargar diagnóstico o ejercicios:', error);
        this.diagnosis = '';
        this.exercises = [];
      } finally {
        this.loading = false;
      }
    },

    async loadExercises(posture) {
      try {
        const resp = await fetch('https://posturaainodejs.onrender.com/posture-exercises');
        const allExercises = await resp.json();

        this.exercises = allExercises.filter(e => e.posture === posture);
        this.allExercises = allExercises;

      } catch (error) {
        console.error('Error al cargar ejercicios:', error);
        this.exercises = [];
        this.allExercises = [];
      }
    },

    mostrarTodosEjercicios() {
      this.showAllExercises = !this.showAllExercises;
    },

    async getImage(query) {
      const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${this.unsplashApiKey}`;
      try {
        const res = await fetch(url);
        if (!res.ok) return '';
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.small;
        }
        return '';
      } catch {
        return '';
      }
    },

    async loadUserName() {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        const respUser = await fetch(`https://posturaainodejs.onrender.com/users/${userId}`);
        if (!respUser.ok) return;
        const userData = await respUser.json();
        this.userName = `${userData.first_name} ${userData.last_name}`;
      } catch (error) {
        console.error('Error cargando nombre de usuario:', error);
        this.userName = '';
      }
    },

    async loadAppLogo() {
      try {
        // Carga logo de URL y convierte a base64 para insertar en PDF
        const logoUrl = 'https://www.gipuzkoafutbola.eus/favicon.ico'; // Ajusta ruta o URL según tu proyecto
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          this.appLogoBase64 = reader.result;
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error cargando logo:', error);
        this.appLogoBase64 = '';
      }
    },

    crearPDF() {
      if (this.exercises.length === 0) {
        alert("No hay ejercicios para generar PDF.");
        return;
      }

      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Encabezado con logo y título
      if (this.appLogoBase64) {
        doc.addImage(this.appLogoBase64, 'PNG', 40, 20, 60, 60);
      }
      doc.setFontSize(22);
      doc.setTextColor('#333');
      doc.text('Informe de Ejercicios Recomendados', pageWidth / 2, 40, { align: 'center' });

      // Subtítulo: usuario y fecha
      doc.setFontSize(12);
      doc.setTextColor('#555');
      const dateStr = new Date().toLocaleDateString();
      doc.text(`Usuario: ${this.userName || 'Invitado'}`, 40, 90);
      doc.text(`Fecha de generación: ${dateStr}`, pageWidth - 40, 90, { align: 'right' });

      // Línea horizontal
      doc.setDrawColor(100, 100, 100);
      doc.setLineWidth(0.5);
      doc.line(40, 100, pageWidth - 40, 100);

      // Título ejercicios para la postura
      doc.setFontSize(16);
      doc.setTextColor('#000');
      doc.text(`Ejercicios para corregir: ${this.diagnosis}`, 40, 130);

      // Listado de ejercicios con estilo
      doc.setFontSize(12);
      let y = 150;
      const margin = 40;
      const maxY = doc.internal.pageSize.getHeight() - 40;

      this.exercises.forEach((exercise, i) => {
        if (y > maxY) {
          doc.addPage();
          y = 40;
        }

        doc.setTextColor('#007bff');
        doc.setFont(undefined, 'bold');
        doc.text(`${i + 1}. ${exercise.name} (${exercise.duration_minutes || '?'} min)`, margin, y);
        y += 16;

        doc.setTextColor('#333');
        doc.setFont(undefined, 'normal');
        const splitDescription = doc.splitTextToSize(exercise.description, pageWidth - margin * 2);
        doc.text(splitDescription, margin, y);
        y += splitDescription.length * 14 + 12;

        // Línea separadora
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.line(margin, y - 8, pageWidth - margin, y - 8);
      });

      // Pie de página con nombre app
      doc.setFontSize(10);
      doc.setTextColor('#999');
      doc.text('Postura AI - Recomendaciones Personalizadas', pageWidth / 2, maxY + 20, { align: 'center' });

      doc.save(`Informe_Ejercicios_${this.diagnosis.replace(/\s+/g, '_')}.pdf`);
    }
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

.exercise-item {
  margin-bottom: 15px;
}

.btn-show-all,
.btn-create-pdf {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: block;
  margin: 10px auto 20px auto;
  transition: background-color 0.3s ease;
}

.btn-show-all:hover,
.btn-create-pdf:hover {
  background-color: #0056b3;
}

.all-exercises-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.1);
}

.exercise-image img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 15px;
}
</style>