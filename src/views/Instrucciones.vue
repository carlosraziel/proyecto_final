<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const idDelPedido = route.params.id

// Variables reactivas para guardar la información de Firebase
const pedido = ref(null)
const receta = ref({ ingredientes: [], proceso: [] })

onMounted(async () => {
  // 1. Obtener la información del pedido al que le dimos clic
  const pedidoRef = doc(db, "Pedidos", idDelPedido)
  const pedidoSnap = await getDoc(pedidoRef)

  if (pedidoSnap.exists()) {
    pedido.value = pedidoSnap.data()

    // 2. Buscar en la colección "Recetas" la que coincida con este pedido
    const recetasSnap = await getDocs(collection(db, "Recetas"))
    recetasSnap.forEach((docReceta) => {
      const dataReceta = docReceta.data()
      
      // Convertimos todo a minúsculas para que "Torta Mediana" coincida con "25 pzs torta mediana"
      const nombreReceta = dataReceta.nombre.toLowerCase()
      const descripcionPedido = pedido.value.descripcion_corta.toLowerCase()

      if (descripcionPedido.includes(nombreReceta)) {
        receta.value = dataReceta
      }
    })
  }
})

const marcarComoFinalizada = async () => {
  try {
    // 3. Cambiar el estado en la base de datos
    const pedidoRef = doc(db, "Pedidos", idDelPedido)
    await updateDoc(pedidoRef, { estado: "listo" }) // Pasa de "preparando" a "listo"
    
    alert("¡Orden marcada como lista para entrega!")
    router.push('/labores')
  } catch (error) {
    alert("Error al finalizar: " + error.message)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <div class="logo-agua">
        <h2>OAXAQUEÑO</h2>
      </div>

      <h3>Jefe Obrador</h3>
      <h4 class="subrayado">Instrucciones de Orden</h4>

      <!-- Solo mostramos la tarjeta si la base de datos ya respondió -->
      <div v-if="pedido" class="tarjeta-lista">
        <div class="encabezados-lista">
          <span>Orden</span>
          <span>Hora de entrega</span>
        </div>
        <hr>
        
        <div class="fila-orden">
          <!-- Datos dinámicos del pedido -->
          <span>{{ pedido.descripcion_corta }}</span>
          <span>{{ pedido.hora_entrega }}</span>
        </div>

        <div v-if="receta.ingredientes.length > 0">
          <h5 class="titulo-seccion subrayado">Ingredientes</h5>
          <ol class="lista-receta">
            <!-- Iteramos sobre los ingredientes de la base de datos -->
            <li v-for="(ingrediente, index) in receta.ingredientes" :key="'ing_'+index">
              {{ ingrediente }}
            </li>
          </ol>

          <h5 class="titulo-seccion subrayado">Proceso de Elaboracion</h5>
          <ol class="lista-receta">
            <!-- Iteramos sobre los pasos de la base de datos -->
            <li v-for="(paso, index) in receta.proceso" :key="'paso_'+index">
              {{ paso }}
            </li>
          </ol>
        </div>
        
        <!-- Mensaje de respaldo si no hay receta para ese pan -->
        <div v-else class="mensaje-vacio">
          <p>No hay una receta registrada que coincida con esta orden.</p>
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-secundario" @click="marcarComoFinalizada">Orden finalizada</button>
      <button class="btn-primario" @click="$router.push('/labores')">Regresar</button>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; overflow-y: auto;}
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; flex-shrink: 0;}
.contenido-central { padding: 20px; text-align: center; color: #333; position: relative;}
.logo-agua h2 { font-family: serif; color: rgba(0, 0, 0, 0.05); font-size: 3.5rem; position: absolute; top: 10%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;}
.subrayado { border-bottom: 1px solid #333; display: inline-block; padding-bottom: 5px; margin-bottom: 10px;}
.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; text-align: left; position: relative; z-index: 1;}
.encabezados-lista, .fila-orden { display: flex; justify-content: space-between; margin: 15px 0; font-family: serif; }
.titulo-seccion { text-align: center; font-family: serif; font-size: 1.1rem; margin-top: 20px; margin-bottom: 10px;}
.lista-receta { font-family: serif; font-size: 0.9rem; padding-left: 20px; margin: 0; line-height: 1.4;}
.mensaje-vacio { font-style: italic; color: #666; text-align: center; margin-top: 20px; font-family: serif;}
.botones-abajo { display: flex; flex-direction: column; align-items: center; gap: 15px; margin: 20px 0; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; width: 200px; cursor: pointer; }
.btn-secundario { background-color: #fff; border: 2px solid #cba344; padding: 10px 40px; border-radius: 20px; width: 200px; font-weight: bold; cursor: pointer; }
</style>