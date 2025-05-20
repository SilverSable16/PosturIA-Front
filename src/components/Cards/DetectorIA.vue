<template>
  <div class="detector-ia">
    <video id="videoElement" width="640" height="480" autoplay></video>

    <div class="button-container">
      <button class="camera-btn start" @click="startCamera">Iniciar Cámara</button>
      <button class="camera-btn stop" @click="stopCamera">Detener Cámara</button>
    </div>

    <div>
      <label for="parte">Parte del cuerpo a analizar:</label>
      <select v-model="parteSeleccionada" id="parte">
        <option value="cuello">Cuello</option>
        <option value="hombros">Hombros</option>
        <option value="espalda">Espalda</option>
        <option value="cintura">Cintura</option>
        <option value="caderas">Caderas</option>
        <option value="rodillas">Rodillas</option>
        <option value="piernas">Piernas</option>
        <option value="tobillos">Tobillos</option>
        <option value="muñecas">Muñecas</option>
        <option value="brazos">Brazos</option>
      </select>
    </div>

    <div v-if="pose">
      <p>Posición de la cabeza: X: {{ pose.keypoints[0].position.x }} Y: {{ pose.keypoints[0].position.y }}</p>
      <p>Diagnóstico: {{ diagnosis }}</p>
    </div>
  </div>
</template>

<script>
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

const cuerpoPorPostura = {
  'cabeza adelantada': 'cuello',
  'cabeza caída': 'cuello',
  'cuello rígido': 'cuello',
  'cabeza rotada': 'cuello',
  'cabeza inclinada lateral': 'cuello',
  'cuello torcido': 'cuello',
  'torsión cervical': 'cuello',

  'hombros desalineados': 'hombros',
  'hombros caídos': 'hombros',
  'hombros tensos': 'hombros',
  'brazos desalineados': 'hombros',

  'espalda encorvada': 'espalda',
  'columna en S': 'espalda',
  'columna en forma de C': 'espalda',
  'hipercifosis dorsal': 'espalda',
  'escápulas aladas': 'espalda',
  'espalda rectificada': 'espalda',
  'torsión de tronco': 'espalda',

  'cintura inclinada': 'cintura',
  'rotación de pelvis': 'cintura',

  'cadera girada': 'caderas',
  'cadera adelantada': 'caderas',
  'caderas desniveladas': 'caderas',
  'cadera caída': 'caderas',

  'rodillas valgas': 'rodillas',
  'rodillas varas': 'rodillas',
  'alineación cruzada de rodillas': 'rodillas',

  'piernas arqueadas': 'piernas',
  'tensión en pantorrillas': 'piernas',
  'torso inclinado': 'piernas',

  'pie plano': 'tobillos',
  'pie supinado': 'tobillos',

  'muñecas caídas': 'muñecas',
  'muñecas desviadas': 'muñecas',

  'codo hiperextendido': 'brazos',
  'antebrazos rotados': 'brazos'
};

export default {
  name: 'DetectorIA',
  data() {
    return {
      pose: null,
      net: null,
      movimientosCabeza: [],
      movimientosColumna: [],
      postures: [],
      videoStream: null,
      diagnosis: '',
      parteSeleccionada: 'cuello'
    };
  },
 async mounted() {
  this.net = await posenet.load();
  await this.cargarPosturas();
  console.log("PoseNet y posturas cargadas");
},

  methods: {
    async startCamera() {
      const video = document.getElementById('videoElement');
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.videoStream;

        video.onloadedmetadata = () => {
          if (video.videoWidth === 0 || video.videoHeight === 0) {
            console.error('El video no tiene dimensiones válidas.');
            return;
          }
          this.startPoseDetection(video);
        };
      } catch (error) {
        console.error("Error al acceder a la cámara: ", error);
      }
    },

    async cargarPosturas() {
    try {
      const res = await fetch("https://posturaia.onrender.com/posturas");
      const data = await res.json();
      this.postures = data;
      console.log("Posturas cargadas:", this.postures);
    } catch (error) {
      console.error("Error al cargar posturas:", error);
    }
  },
    async startPoseDetection(video) {
      const detectPose = async () => {
        const pose = await this.net.estimateSinglePose(video, { flipHorizontal: false });
        this.pose = pose;
        await this.diagnosePosture(pose);
        this.$emit('poseDetected', pose);
        requestAnimationFrame(detectPose);
      };
      detectPose();
    },

    saveDiagnosisToLocalStorage(diagnosis) {
      const diagnostics = JSON.parse(localStorage.getItem('diagnostics')) || [];
      diagnostics.push({ diagnosis, timestamp: new Date() });
      localStorage.setItem('diagnostics', JSON.stringify(diagnostics));
      console.log('Diagnóstico guardado en localStorage');
    },

    stopCamera() {
      if (this.videoStream) {
        this.saveDiagnosisToLocalStorage(this.diagnosis);
        const tracks = this.videoStream.getTracks();
        tracks.forEach(track => track.stop());
        this.videoStream = null;
        console.log("Cámara detenida");
      }
    },

    async registrarAnalisis(payload) {
      try {
        const response = await fetch("https://posturaia.onrender.com/analisis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        console.log("Análisis registrado:", result);
      } catch (error) {
        console.error("Error al registrar análisis:", error);
      }
    },

   obtenerPostureIdLocal(nombre) {
  const match = this.postures.find(p => p.name.trim().toLowerCase() === nombre.trim().toLowerCase());
  return match ? match.id : null;
},

    calcularDesviacion(valores) {
      const media = valores.reduce((acc, val) => acc + val, 0) / valores.length;
      const varianza = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
      return Math.sqrt(varianza);
    },

async diagnosePosture(pose) {
  const puntosConfiables = pose.keypoints.filter(k => k.score > 0.5);
  if (puntosConfiables.length < 10) {
    this.diagnosis = 'Detección insuficiente';
    return;
  }

  const keypoints = Object.fromEntries(puntosConfiables.map(k => [k.part, k]));
  const detecciones = [];

  let alturaTorso = 1;
  if (keypoints.leftShoulder && keypoints.leftHip) {
    alturaTorso = Math.abs(keypoints.leftShoulder.position.y - keypoints.leftHip.position.y);
  }
  const normalizar = (v) => v / alturaTorso;

  const distanciaX = (a, b) => Math.abs(a.position.x - b.position.x);
  const distanciaY = (a, b) => Math.abs(a.position.y - b.position.y);
  const media = (a, b) => (a + b) / 2;
  const push = (cond, nombre, score) => { if (cond) detecciones.push({ name: nombre, score }); };

  // Reglas optimizadas corregidas según partes del cuerpo coherentes

  // HIPERLORDOSIS LUMBAR
  if (keypoints.leftHip && keypoints.leftShoulder) {
    const curvatura = keypoints.leftShoulder.position.y - keypoints.leftHip.position.y;
    push(curvatura > 150, 'hiperlordosis lumbar', 45);
  }

  // TENSIÓN EN PANTORRILLAS
  if (keypoints.leftKnee && keypoints.leftAnkle) {
    const diferencia = distanciaY(keypoints.leftKnee, keypoints.leftAnkle);
    push(diferencia < 30, 'tensión en pantorrillas', 41);
  }
  push(keypoints.nose && keypoints.leftShoulder && keypoints.rightShoulder && normalizar(keypoints.nose.position.x - media(keypoints.leftShoulder.position.x, keypoints.rightShoulder.position.x)) > 0.35, 'cabeza adelantada', 45);
  push(keypoints.nose && keypoints.leftEye && keypoints.rightEye && normalizar(keypoints.nose.position.y - media(keypoints.leftEye.position.y, keypoints.rightEye.position.y)) > 0.4, 'cabeza caída', 43);

  push(keypoints.leftShoulder && keypoints.rightShoulder && normalizar(distanciaY(keypoints.leftShoulder, keypoints.rightShoulder)) > 0.4, 'hombros desalineados', 50);
  push(keypoints.leftShoulder && keypoints.leftHip && normalizar(distanciaY(keypoints.leftShoulder, keypoints.leftHip)) < 0.9, 'hombros caídos', 47);

  push(keypoints.leftHip && keypoints.rightHip && normalizar(distanciaY(keypoints.leftHip, keypoints.rightHip)) > 0.35, 'cintura inclinada', 46);
  push(keypoints.leftShoulder && keypoints.leftHip && normalizar(distanciaX(keypoints.leftShoulder, keypoints.leftHip)) > 0.35, 'espalda encorvada', 49);
  push(keypoints.leftShoulder && keypoints.leftHip && normalizar(distanciaX(keypoints.leftShoulder, keypoints.leftHip)) < 0.1, 'espalda rectificada', 42);

  push(keypoints.leftHip && keypoints.rightHip && normalizar(distanciaY(keypoints.leftHip, keypoints.rightHip)) > 0.3, 'caderas desniveladas', 48);
  push(keypoints.leftHip && keypoints.rightHip && normalizar(distanciaX(keypoints.leftHip, keypoints.rightHip)) > 0.35, 'cadera girada', 44);

  if (keypoints.leftKnee && keypoints.rightKnee && keypoints.leftAnkle && keypoints.rightAnkle) {
    const distKnee = distanciaX(keypoints.leftKnee, keypoints.rightKnee);
    const distAnkle = distanciaX(keypoints.leftAnkle, keypoints.rightAnkle);
    push(distKnee < distAnkle - 30, 'rodillas valgas', 44);
    push(distKnee > distAnkle + 30, 'rodillas varas', 44);
    push(Math.abs(keypoints.leftKnee.position.y - keypoints.rightKnee.position.y) > 40, 'alineación cruzada de rodillas', 43);
    push(distKnee > distAnkle + 40, 'piernas arqueadas', 43);
  }

  push(keypoints.leftShoulder && keypoints.leftHip && Math.abs(keypoints.leftShoulder.position.y - keypoints.leftHip.position.y) > 120, 'torso inclinado', 45);
  push(keypoints.leftShoulder && keypoints.leftHip && keypoints.leftShoulder.position.y - keypoints.leftHip.position.y < -30, 'inclinación torácica', 43);

  if (keypoints.nose && keypoints.leftEye && keypoints.rightEye) {
    const centro = media(keypoints.leftEye.position.x, keypoints.rightEye.position.x);
    const off = Math.abs(keypoints.nose.position.x - centro);
    const diff = distanciaX(keypoints.leftEye, keypoints.rightEye);
    push(off > diff * 0.7, 'cabeza rotada', 43);
    push(Math.abs(keypoints.nose.position.x - centro) > 20, 'cuello torcido', 42);
  }

  if (keypoints.nose) {
    this.movimientosCabeza = this.movimientosCabeza || [];
    this.movimientosCabeza.push({ x: keypoints.nose.position.x, y: keypoints.nose.position.y });
    if (this.movimientosCabeza.length > 30) {
      this.movimientosCabeza.shift();
      const dx = this.calcularDesviacion(this.movimientosCabeza.map(p => p.x));
      const dy = this.calcularDesviacion(this.movimientosCabeza.map(p => p.y));
      push(dx < 5 && dy < 5, 'cuello rígido', 42);
    }
  }

  push(keypoints.leftShoulder && keypoints.rightShoulder && keypoints.leftHip && keypoints.rightHip && (keypoints.leftShoulder.position.y - keypoints.rightShoulder.position.y) * (keypoints.leftHip.position.y - keypoints.rightHip.position.y) < 0, 'columna en S', 48);

  push(keypoints.leftHip && keypoints.leftShoulder && normalizar(keypoints.leftHip.position.x - keypoints.leftShoulder.position.x) > 0.35, 'cadera adelantada', 46);
  push(keypoints.leftShoulder && keypoints.nose && keypoints.leftShoulder.position.y < keypoints.nose.position.y + 20, 'hombros tensos', 47);
  push(keypoints.leftShoulder && keypoints.leftElbow && normalizar(distanciaX(keypoints.leftShoulder, keypoints.leftElbow)) > 0.6, 'escápulas aladas', 47);
  push(keypoints.leftShoulder && keypoints.leftEar && normalizar(distanciaY(keypoints.leftShoulder, keypoints.leftEar)) > 0.5, 'hipercifosis dorsal', 48);
  push(keypoints.leftShoulder && keypoints.leftHip && (keypoints.leftShoulder.position.y - keypoints.leftHip.position.y) > 80, 'columna en forma de C', 44);
  push(keypoints.leftShoulder && keypoints.rightHip && normalizar(distanciaX(keypoints.leftShoulder, keypoints.rightHip)) < 0.2, 'torsión de tronco', 45);

  if (keypoints.leftAnkle && keypoints.rightAnkle) {
    const ankleY = media(keypoints.leftAnkle.position.y, keypoints.rightAnkle.position.y);
    push(ankleY > 450, 'pie plano', 41);
  }

  push(keypoints.leftAnkle && keypoints.leftFootIndex && normalizar(distanciaX(keypoints.leftAnkle, keypoints.leftFootIndex)) > 0.4, 'pie supinado', 42);
  push(keypoints.leftAnkle && keypoints.leftFootIndex && normalizar(distanciaX(keypoints.leftAnkle, keypoints.leftFootIndex)) > 0.5, 'tobillos rotados', 44);

  push(keypoints.leftKnee && keypoints.rightKnee && normalizar(distanciaY(keypoints.leftKnee, keypoints.rightKnee)) > 0.5, 'piernas disparejas', 43);

  if (keypoints.leftWrist && keypoints.leftElbow) {
    push(keypoints.leftWrist.position.y - keypoints.leftElbow.position.y > 40, 'muñecas caídas', 40);
    push(distanciaX(keypoints.leftWrist, keypoints.leftElbow) > 50, 'muñecas desviadas', 41);
  }

  push(keypoints.leftShoulder && keypoints.leftElbow && keypoints.leftWrist && ((keypoints.leftWrist.position.x > keypoints.leftShoulder.position.x && keypoints.leftElbow.position.x > keypoints.leftWrist.position.x) || (keypoints.leftWrist.position.x < keypoints.leftShoulder.position.x && keypoints.leftElbow.position.x < keypoints.leftWrist.position.x)), 'codo hiperextendido', 42);
  push(keypoints.leftElbow && keypoints.leftWrist && distanciaX(keypoints.leftElbow, keypoints.leftWrist) < 20, 'antebrazos rotados', 41);
  push(keypoints.leftElbow && keypoints.rightElbow && distanciaX(keypoints.leftElbow, keypoints.rightElbow) > 60, 'brazos desalineados', 43);

  if (keypoints.leftShoulder && keypoints.leftHip) {
    const deltaX = keypoints.leftShoulder.position.x - keypoints.leftHip.position.x;
    this.movimientosColumna = this.movimientosColumna || [];
    this.movimientosColumna.push(deltaX);
    if (this.movimientosColumna.length > 30) {
      this.movimientosColumna.shift();
      const desviacion = this.calcularDesviacion(this.movimientosColumna);
      if (desviacion < 5) {
        detecciones.push({ name: 'columna en forma de C', score: 42 });
        this.movimientosColumna = [];
      }
    }
  }

  const filtradas = detecciones.filter(d => cuerpoPorPostura[d.name] === this.parteSeleccionada);

  if (filtradas.length > 0) {
    const { name, score } = filtradas[0];
    this.diagnosis = `Postura incorrecta: ${name}`;
    const postureId = this.obtenerPostureIdLocal(name);
    const status = 'En progreso';
    if (postureId) {
      await this.registrarAnalisis({ user_id: 1, score, status, posture_id: postureId });
    }
  } else {
    this.diagnosis = 'Postura correcta';
  }
}

  },
};   
</script>

<style lang="scss">
/* Estilo para el video y los botones aquí... */
</style>