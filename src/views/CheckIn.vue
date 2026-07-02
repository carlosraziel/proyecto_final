<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, updateDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const idDelPedido = route.params.id

// Variables para el formulario
const nombreRemitente = ref('')
const checks = ref({ mercancia: false, cantidades: false, exitosa: false })

// Variables para el Canvas (Lienzo)
const canvasRef = ref(null)
let ctx = null
let isDrawing = false

onMounted(() => {
  // Inicializamos el lienzo de dibujo
  const canvas = canvasRef.value
  // Ajustamos la resolución interna del canvas al tamaño visual
  canvas.width = canvas.offsetWidth
  canvas.height = 150 
  
  ctx = canvas.getContext('2d')
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#000'
})

// --- LÓGICA DE DIBUJO ---
const obtenerCoordenadas = (event) => {
  const canvas = canvasRef.value
  const rect = canvas.getBoundingClientRect()
  // Soporte para Táctil (touches) y Mouse (clientX)
  const clientX = event.clientX || (event.touches && event.touches[0].clientX)
  const clientY = event.clientY || (event.touches && event.touches[0].clientY)
  return { x: clientX - rect.left, y: clientY - rect.top }
}

const empezarDibujo = (e) => {
  e.preventDefault() // Evita que la pantalla haga scroll al tocar
  isDrawing = true
  const { x, y } = obtenerCoordenadas(e)
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const dibujar = (e) => {
  if (!isDrawing) return
  e.preventDefault()
  const { x, y } = obtenerCoordenadas(e)
  ctx.lineTo(x, y)
  ctx.stroke()
}

const detenerDibujo = () => {
  isDrawing = false
  ctx.closePath()
}

const limpiarFirma = () => {
  const canvas = canvasRef.value
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
// ------------------------

const finalizarEntrega = async () => {
  if (!nombreRemitente.value) {
    alert("Por favor, ingresa el nombre de quien recibe.")
    return
  }

  try {
    // Extraemos la firma dibujada como una imagen codificada (Base64)
    const firmaImagenBase64 = canvasRef.value.toDataURL('image/png')

    // Actualizamos Firebase
    const pedidoRef = doc(db, "Pedidos", idDelPedido)
    await updateDoc(pedidoRef, { 
      estado: "entregado",
      firma_cliente: firmaImagenBase64,
      nombre_recibe: nombreRemitente.value,
      confirmaciones: checks.value
    })
    
    alert("¡Entrega registrada exitosamente!")
    router.push('/entregas') // Regresamos al repartidor a su lista de pendientes
  } catch (error) {
    alert("Error al guardar: " + error.message)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <!-- Logo Superior -->
      <div class="logo-container">
        <p class="logo-small">PANADERÍA ARTESANAL EL</p>
        <h1 class="logo-main">OAXAQUEÑO</h1>
        <p class="logo-sub">SAMUEL CRUZ</p>
      </div>

      <div class="tarjeta-lista contenedor-camioneta">
        <div class="fondo-reparto">REPARTO</div>
        
        <h5 class="titulo-seccion">Confirmacion de Entrega</h5>
        
        <!-- Checkboxes de validación -->
        <div class="grupo-checks">
          <label class="check-item">
            <input type="checkbox" v-model="checks.mercancia">
            <span>Mercancia completa</span>
          </label>
          <label class="check-item">
            <input type="checkbox" v-model="checks.cantidades">
            <span>Cantidades ajustadas (si aplica)</span>
          </label>
          <label class="check-item">
            <input type="checkbox" v-model="checks.exitosa">
            <span>Entrega completa exitosa</span>
          </label>
        </div>

        <!-- Zona de Firma -->
        <div class="zona-firma">
          <button class="btn-limpiar" @click="limpiarFirma">Limpiar Firma</button>
          
          <!-- Eventos para Mouse y Táctil -->
          <canvas 
            ref="canvasRef" 
            class="lienzo-firma"
            @mousedown="empezarDibujo"
            @mousemove="dibujar"
            @mouseup="detenerDibujo"
            @mouseleave="detenerDibujo"
            @touchstart="empezarDibujo"
            @touchmove="dibujar"
            @touchend="detenerDibujo"
          ></canvas>
          
          <input v-model="nombreRemitente" type="text" placeholder="Nombre y Firma de Remitente" class="input-linea" />
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-secundario" @click="finalizarEntrega">Guardar Cambios y Continuar</button>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; flex-shrink: 0; }
.contenido-central { padding: 20px; text-align: center; color: #333; }

/* Logo */
.logo-container { margin-bottom: 20px; color: #333; }
.logo-small { font-size: 0.8rem; letter-spacing: 1px; margin: 0; font-family: sans-serif; font-weight: bold;}
.logo-main { font-size: 2.5rem; font-family: serif; margin: 0; letter-spacing: 2px; }
.logo-sub { font-size: 0.9rem; letter-spacing: 3px; margin: 0; border-top: 1px solid #333; display: inline-block; padding-top: 5px; font-family: sans-serif;}

/* Tarjeta */
.contenedor-camioneta { position: relative; overflow: hidden; }
.fondo-reparto { position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); font-size: 3.5rem; font-family: serif; color: rgba(0, 0, 0, 0.05); font-weight: bold; pointer-events: none; z-index: 0; }
.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; position: relative; z-index: 1; text-align: left;}
.titulo-seccion { text-align: center; font-family: serif; font-size: 1.1rem; margin: 0 0 15px 0; border-bottom: 1px solid #333; padding-bottom: 5px;}

/* Checkboxes */
.grupo-checks { display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px; font-family: serif; font-weight: bold;}
.check-item { display: flex; align-items: center; gap: 15px; cursor: pointer;}
.check-item input { width: 20px; height: 20px; }

/* Firma */
.zona-firma { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 20px;}
.btn-limpiar { align-self: flex-end; background: none; border: none; color: #666; text-decoration: underline; cursor: pointer; font-size: 0.8rem;}
.lienzo-firma { 
  width: 100%; 
  border: 1px solid #333; 
  border-radius: 10px; 
  background-color: #fff; 
  /* touch-action: none es VITAL para que la pantalla no scrollee mientras firmas con el dedo */
  touch-action: none; 
  cursor: crosshair;
}
.input-linea { background: transparent; border: none; border-bottom: 1px solid #333; padding: 5px; font-family: serif; width: 100%; text-align: center; outline: none; margin-top: 10px;}

/* Botones */
.botones-abajo { display: flex; justify-content: center; margin: 20px 0; }
.btn-secundario { background-color: #fff; border: 2px solid #cba344; padding: 10px 30px; border-radius: 20px; font-weight: bold; cursor: pointer; width: 280px;}
</style>