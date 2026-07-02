<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
// Capturamos el ID del pedido desde la URL
const idDelPedido = route.params.id

const pedido = ref(null)

onMounted(async () => {
  // Traemos los datos de la entrega específica
  const pedidoRef = doc(db, "Pedidos", idDelPedido)
  const pedidoSnap = await getDoc(pedidoRef)
  
  if (pedidoSnap.exists()) {
    pedido.value = pedidoSnap.data()
  }
})

const confirmarLlegada = () => {
  // En una app real, esto se dispararía al leer la cámara.
  // Al confirmar, lo mandaremos a la ruta de "Detalles" (que crearemos en el siguiente paso).
  router.push(`/detalle-entrega/${idDelPedido}`)
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

      <div v-if="pedido" class="tarjeta-lista contenedor-camioneta">
        <div class="fondo-reparto">REPARTO</div>

        <div class="encabezados-lista">
          <span>Orden</span>
          <span>Hora de entrega</span>
        </div>
        <hr>
        
        <div class="fila-orden">
          <span>{{ pedido.destino || pedido.descripcion_corta }}</span>
          <span>{{ pedido.hora_entrega }}</span>
        </div>

        <div class="mensaje-alerta">
          Por favor, permita que el encargado escanee para confirmar la llegada
        </div>

        <!-- Código de barras simulado (con CSS puro) -->
        <div class="codigo-barras" @click="confirmarLlegada">
          <div class="barras"></div>
          <p class="texto-clic">(Toca el código para simular escaneo)</p>
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-secundario" @click="confirmarLlegada">Ver detalles de Pedido</button>
      <button class="btn-primario" @click="$router.push('/entregas')">Regresar</button>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; flex-shrink: 0; }
.contenido-central { padding: 20px; text-align: center; color: #333; }

/* Estilos del Logo */
.logo-container { margin-bottom: 20px; color: #333; }
.logo-small { font-size: 0.8rem; letter-spacing: 1px; margin: 0; font-family: sans-serif; font-weight: bold;}
.logo-main { font-size: 2.5rem; font-family: serif; margin: 0; letter-spacing: 2px; }
.logo-sub { font-size: 0.9rem; letter-spacing: 3px; margin: 0; border-top: 1px solid #333; display: inline-block; padding-top: 5px; font-family: sans-serif;}

/* Tarjeta y Fondo */
.contenedor-camioneta { position: relative; overflow: hidden; }
.fondo-reparto { position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); font-size: 3.5rem; font-family: serif; color: rgba(0, 0, 0, 0.05); font-weight: bold; pointer-events: none; z-index: 0; }
.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; position: relative; z-index: 1; }
.encabezados-lista, .fila-orden { display: flex; justify-content: space-between; margin: 15px 0; font-family: serif; }

/* Mensaje y Escáner */
.mensaje-alerta { background-color: #dcdcdc; border: 1px solid #999; border-radius: 10px; padding: 15px; margin: 20px 0; font-family: serif; font-style: italic; }
.codigo-barras { margin-top: 20px; cursor: pointer; padding: 10px; border-radius: 10px; transition: background 0.3s; }
.codigo-barras:hover { background-color: #ddd; }
.barras { height: 80px; width: 100%; background: repeating-linear-gradient( 90deg, #000, #000 3px, transparent 3px, transparent 6px, #000 6px, #000 10px, transparent 10px, transparent 12px ); }
.texto-clic { font-size: 0.8rem; color: #666; margin-top: 10px; font-family: sans-serif; }

/* Botones */
.botones-abajo { display: flex; flex-direction: column; align-items: center; gap: 15px; margin: 20px 0; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; width: 250px; cursor: pointer; }
.btn-secundario { background-color: #fff; border: 2px solid #cba344; padding: 10px 40px; border-radius: 20px; width: 250px; font-weight: bold; cursor: pointer; }
</style>