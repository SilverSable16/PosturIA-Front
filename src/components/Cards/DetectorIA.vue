<template>
  <div class="detector-ia" style="display: flex; gap: 20px;">
    <div style="position: relative;">
      <video id="videoElement" width="640" height="480" autoplay></video>
      <canvas id="overlay" width="640" height="480" style="position: absolute; top: 0; left: 0;"></canvas>

      <!-- Botones con display:flex y gap -->
      <div class="button-container" style="margin-top: 10px; display: flex; gap: 10px;">
        <button class="camera-btn start" @click="startCamera">Iniciar Cámara</button>
        <button class="camera-btn stop"  @click="stopCamera">Detener Cámara</button>
      </div>

      <div class="selector-container">
  <label for="parte">Parte del cuerpo a analizar:</label>
  <select v-model="parteSeleccionada" id="parte">
    <option value="cuello">Cabeza</option>
    <option value="hombros">Hombros</option>
  </select>
</div>



      <div v-if="pose" style="margin-top: 10px; max-height: 300px; overflow-y: auto;">
        <p><strong>Diagnóstico actual:</strong> {{ diagnosis }}</p>
        <h3>Posiciones de los puntos detectados (score > 0.4):</h3>
        <ul>
          <li v-for="point in pose.keypoints.filter(k => k.score > 0.4)" :key="point.part">
            {{ point.part }}: X: {{ Math.round(point.position.x) }}, Y: {{ Math.round(point.position.y) }}
          </li>
        </ul>
      </div>
    </div>



    <div>
      <h3>Visualización puntos detectados</h3>
      <canvas id="miniOverlay" width="320" height="240" style="border: 1px solid #ccc;"></canvas>
    </div>
    <div style="margin-top: 20px;">
  <h3>Posturas incorrectas detectadas:</h3>
  <ul>
    <li v-for="(item, index) in incorrectPostures" :key="index">
      {{ item.postura }} - {{ new Date(item.timestamp).toLocaleString() }}
    </li>
  </ul>
</div>
  </div>
</template>

<script>
import * as posenet from '@tensorflow-models/posenet';
import * as tf from '@tensorflow/tfjs';

const colorPunto = 'aqua';
const colorLinea = 'red';
const radioPunto = 5;
const lineWidth = 2;

const skeletonConnections = [
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
  ['nose', 'leftEye'],
  ['nose', 'rightEye'],
  ['leftEye', 'leftEar'],
  ['rightEye', 'rightEar']
];

function dibujarMiniPuntosConTexto(ctx, keypoints, minConfidence = 0.4) {
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = 'orange';

  const scaleX = ctx.canvas.width / 640;
  const scaleY = ctx.canvas.height / 480;

  keypoints.forEach(k => {
    if (k.score >= minConfidence) {
      const x = k.position.x * scaleX;
      const y = k.position.y * scaleY;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillText(k.part, x, y - 6);
    }
  });
}

function dibujarMiniEsqueleto(ctx, keypoints, connections, minConfidence = 0.4) {
  const scaleX = ctx.canvas.width / 640;
  const scaleY = ctx.canvas.height / 480;

  connections.forEach(([partA, partB]) => {
    const puntoA = keypoints.find(k => k.part === partA);
    const puntoB = keypoints.find(k => k.part === partB);

    if (puntoA && puntoB && puntoA.score >= minConfidence && puntoB.score >= minConfidence) {
      ctx.beginPath();
      ctx.moveTo(puntoA.position.x * scaleX, puntoA.position.y * scaleY);
      ctx.lineTo(puntoB.position.x * scaleX, puntoB.position.y * scaleY);
      ctx.strokeStyle = colorLinea;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  });
}

export default {
  name: 'DetectorIA',
  data() {
    return {

    
      pose: null,
      net: null,
      videoStream: null,
      incorrectPostures: [],
      recordingTimeout: null,
      diagnosisByPart: {
        cuello: '',
        hombros: '',
        // Puedes agregar más partes si quieres
      },
      parteSeleccionada: 'cuello',
      diagnosis: '',
      diagnosisInterval: null,
    };
  },
  async mounted() {
    this.net = await posenet.load();
    console.log("PoseNet cargado");
  },
  methods: {
    async startCamera() {
  const video = document.getElementById('videoElement');
  try {
    this.videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = this.videoStream;

    video.onloadedmetadata = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('Video no tiene dimensiones válidas.');
        return;
      }
      this.startPoseDetection(video);

      // Inicia temporizador para 10 minutos (600,000 ms)
      this.recordingTimeout = setTimeout(() => {
        this.stopCamera();
        alert('Tiempo de grabación finalizado (10 minutos).');
      }, 100000);
    };
  } catch (error) {
    console.error("Error al acceder a la cámara: ", error);
  }
},

    async startPoseDetection(video) {
      const miniCanvas = document.getElementById('miniOverlay');
      const miniCtx = miniCanvas.getContext('2d');

      // Intervalo para diagnóstico cada 5 segundos
      this.diagnosisInterval = setInterval(async () => {
        const pose = await this.net.estimateSinglePose(video, { flipHorizontal: true });
        this.pose = pose;

        // Llamar al método que evalúa según la parte seleccionada
        this.evaluateSelectedPart(pose);

        // Actualizar diagnóstico general para mostrar solo la parte seleccionada
        this.diagnosis = this.diagnosisByPart[this.parteSeleccionada];

        miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
        dibujarMiniEsqueleto(miniCtx, pose.keypoints, skeletonConnections, 0.4);
        dibujarMiniPuntosConTexto(miniCtx, pose.keypoints, 0.4);
      }, 5000);

      // Loop para dibujo continuo
      const detectPose = async () => {
        const pose = await this.net.estimateSinglePose(video, { flipHorizontal: true });
        this.pose = pose;

        miniCtx.clearRect(0, 0, miniCanvas.width, miniCanvas.height);
        dibujarMiniEsqueleto(miniCtx, pose.keypoints, skeletonConnections, 0.4);
        dibujarMiniPuntosConTexto(miniCtx, pose.keypoints, 0.4);

        requestAnimationFrame(detectPose);
      };
      detectPose();
    },

    evaluateSelectedPart(pose) {
  let diagnosisTemp = '';

  switch (this.parteSeleccionada) {
    case 'cuello':
      diagnosisTemp = this.evaluateCuello(pose);
      break;
    case 'hombros':
      diagnosisTemp = this.evaluateHombros(pose);
      break;
    default:
      diagnosisTemp = "Diagnóstico no implementado para esta parte";
      break;
  }

  this.diagnosisByPart[this.parteSeleccionada] = diagnosisTemp;
  this.diagnosis = diagnosisTemp;

  // Guardar todas las posturas incorrectas con timestamp
  const buenaPosturaTexts = ['Cuello en buena postura', 'Hombros nivelados'];
  if (!buenaPosturaTexts.includes(diagnosisTemp)) {
    this.incorrectPostures.push({
      postura: diagnosisTemp,
      timestamp: new Date()
    });

    // Aquí guardamos en la base de datos
    this.savePostureAnalysis(diagnosisTemp, this.parteSeleccionada, 'En progreso');
  }

  if (this.incorrectPostures.length > 50) {
    this.incorrectPostures.shift(); // opcional para limitar la lista
  }
},


    evaluateCuello(pose) {
  const keypoints = pose.keypoints.filter(k => k.score > 0.1);
  const leftShoulder = keypoints.find(k => k.part === 'leftShoulder');
  const rightShoulder = keypoints.find(k => k.part === 'rightShoulder');
  const nose = keypoints.find(k => k.part === 'nose');

  if (!leftShoulder || !rightShoulder || !nose) {
    return "Puntos insuficientes para diagnóstico de cuello";
  }

  const centerX = (leftShoulder.position.x + rightShoulder.position.x) / 2;
  const noseOffsetX = nose.position.x - centerX;
  const centerShouldersY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
  const noseYOffset = nose.position.y - centerShouldersY;

  const maxShoulderDiffY = 20;
  const maxNoseCenterOffset = 15;
  const maxHeadTilt = 20;

  const diffShoulderY = Math.abs(leftShoulder.position.y - rightShoulder.position.y);
  if (diffShoulderY > maxShoulderDiffY) {
    return "Hombros desalineados";
  }

  if (noseYOffset > maxHeadTilt) {
    return "Cabeza caída";
  }

  if (noseOffsetX > maxNoseCenterOffset) {
    return "Cabeza desviada hacia la derecha";
  } else if (noseOffsetX < -maxNoseCenterOffset) {
    return "Cabeza desviada hacia la izquierda";
  } else {
    return "Cuello en buena postura";
  }
},


    evaluateHombros(pose) {
  const keypoints = pose.keypoints.filter(k => k.score > 0.1);
  const leftShoulder = keypoints.find(k => k.part === 'leftShoulder');
  const rightShoulder = keypoints.find(k => k.part === 'rightShoulder');

  if (!leftShoulder || !rightShoulder) {
    this.diagnosisByPart.hombros = "Puntos insuficientes para diagnóstico de hombros";
    return;
  }

  const diffShoulderY = leftShoulder.position.y - rightShoulder.position.y;
  const umbralNivelacion = 15; // pixeles

  if (Math.abs(diffShoulderY) < umbralNivelacion) {
    this.diagnosisByPart.hombros = "Hombros nivelados";
  } else if (diffShoulderY > umbralNivelacion) {
    // Aquí invertimos: si leftShoulder está más alto, en realidad es el hombro derecho del usuario
    this.diagnosisByPart.hombros = "Hombro derecho más alto";
  } else if (diffShoulderY < -umbralNivelacion) {
    // Si rightShoulder está más alto, es el hombro izquierdo del usuario
    this.diagnosisByPart.hombros = "Hombro izquierdo más alto";
  }
},


    stopCamera() {
  if (this.videoStream) {
    const tracks = this.videoStream.getTracks();
    tracks.forEach(t => t.stop());
    this.videoStream = null;
    this.diagnosis = '';
    this.pose = null;
    clearInterval(this.diagnosisInterval);
    
    // Limpia timeout de grabación
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
      this.recordingTimeout = null;
    }
    
    console.log("Cámara detenida");
  }
},

async savePostureAnalysis(currentPosture, bodyPart, status = 'En progreso') {
  try {
    // Obtener user_id del localStorage (guardado en login)
    const user_id = localStorage.getItem('userId');
    if (!user_id) {
      console.warn('No se encontró user_id en localStorage');
      return;
    }

    // Construir payload
    const payload = {
      user_id: parseInt(user_id),
      current_posture: currentPosture,
      body_part: bodyPart,
      status
    };

    // Llamar API POST para guardar análisis
    await fetch('https://posturaainodejs.onrender.com/posture-analyses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Análisis postural guardado:', payload);
  } catch (error) {
    console.error('Error al guardar análisis postural:', error);
  }
},


  }
};
</script>

<style scoped>
.camera-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.camera-btn:active {
  transform: scale(0.98);
}

/* Botón Iniciar – color primario */
.camera-btn.start {
  background-color: #4f46e5;   /* púrpura intenso */
  color: #ffffff;
}
.camera-btn.start:hover {
  background-color: #4338ca;
}

/* Botón Detener – color de alerta */
.camera-btn.stop {
  background-color: #ef4444;   /* rojo */
  color: #ffffff;
}
.camera-btn.stop:hover {
  background-color: #dc2626;
}
.selector-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 10px;
}

.selector-container label {
  font-weight: 500;
  color: #374151; /* gris oscuro */
}

.selector-container select {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: #ffffff;
  color: #374151;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.selector-container select:focus {
  outline: none;
  border-color: #4f46e5; /* púrpura */
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.3);
}

</style>