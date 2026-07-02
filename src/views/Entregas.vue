<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const router = useRouter()
const pedidosListos = ref([])

onMounted(() => {
  // Ahora filtramos buscando solo los que tengan estado "listo"
  const q = query(collection(db, "Pedidos"), where("estado", "==", "listo"))
  
  onSnapshot(q, (querySnapshot) => {
    const ordenesTemporal = []
    querySnapshot.forEach((doc) => {
      ordenesTemporal.push({ id: doc.id, ...doc.data() })
    })
    pedidosListos.value = ordenesTemporal
  })
})

const iniciarEntrega = (idPedido) => {
  // Más adelante crearemos esta ruta para el escáner
  router.push(`/escaner/${idPedido}`)
}

const salir = () => {
  router.push('/')
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <h2 class="fuente-cursiva">Bienvenido</h2>
      <h3>Repartidor</h3>
      <h4 class="subrayado">Labores del dia</h4>

      <div class="tarjeta-lista contenedor-camioneta">
        <!-- Logo translúcido de la camioneta (opcional, simulado por CSS) -->
        <div class="fondo-reparto">REPARTO</div>

        <div class="encabezados-lista">
          <span>Orden</span>
          <span>Hora de entrega</span>
        </div>
        <hr>
        
        <div v-if="pedidosListos.length === 0" class="mensaje-vacio">
          No hay entregas pendientes por el momento.
        </div>

        <div v-for="pedido in pedidosListos" :key="pedido.id" class="fila-orden clickeable" @click="iniciarEntrega(pedido.id)">
          <!-- Asumiendo que guardaremos el destino en Firebase, si no, usamos la descripción -->
          <span>{{ pedido.destino || pedido.descripcion_corta }}</span>
          <span>{{ pedido.hora_entrega }}</span>
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-primario" @click="salir">Salir</button>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; }
.contenido-central { padding: 20px; text-align: center; color: #333; }
.fuente-cursiva { font-family: 'Brush Script MT', cursive; font-size: 2rem; margin-bottom: 0;}
.subrayado { border-bottom: 1px solid #333; display: inline-block; padding-bottom: 5px; margin-bottom: 20px;}

.contenedor-camioneta {
  position: relative;
  overflow: hidden;
}
.fondo-reparto {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3.5rem;
  font-family: serif;
  color: rgba(0, 0, 0, 0.05);
  font-weight: bold;
  pointer-events: none;
  z-index: 0;
}

.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; min-height: 250px; position: relative; z-index: 1;}
.encabezados-lista, .fila-orden { display: flex; justify-content: space-between; margin: 15px 0; font-family: serif; position: relative; z-index: 1;}
.clickeable { cursor: pointer; }
.clickeable:hover { font-weight: bold; }
.mensaje-vacio { font-style: italic; color: #666; margin-top: 30px; font-family: serif;}
.botones-abajo { display: flex; justify-content: center; margin-bottom: 20px; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; width: 200px; cursor: pointer; }
</style>