<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'

const router = useRouter()
const pedidos = ref([])

onMounted(() => {
  // Apuntamos a la colección "Pedidos" y filtramos los que tengan estado "preparando"
  const q = query(collection(db, "Pedidos"), where("estado", "==", "preparando"))
  
  
  onSnapshot(q, (querySnapshot) => {
    const ordenesTemporal = []
    querySnapshot.forEach((doc) => {
      // Guardamos el ID único de Firebase junto con los datos del pedido
      ordenesTemporal.push({ id: doc.id, ...doc.data() })
    })
    // Actualizamos nuestra variable reactiva
    pedidos.value = ordenesTemporal
  })
})

const salir = () => {
  router.push('/')
}
const verInstrucciones = (idPedido) => {
  // Navegamos a la nueva pantalla pasándole el ID del pedido en la URL
  router.push(`/instrucciones/${idPedido}`)
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <h2 class="fuente-cursiva">Bienvenido</h2>
      <h3>Jefe Obrador</h3>
      <h4 class="subrayado">Labores del dia</h4>

      <div class="tarjeta-lista">
        <div class="encabezados-lista">
          <span>Orden</span>
          <span>Hora de entrega</span>
        </div>
        <hr>
        
        <!-- Si no hay pedidos, mostramos este mensaje -->
        <div v-if="pedidos.length === 0" class="mensaje-vacio">
          No hay pedidos pendientes en este momento.
        </div>

        <div v-for="pedido in pedidos" :key="pedido.id" class="fila-orden clickeable" @click="verInstrucciones(pedido.id)">
          <span>{{ pedido.descripcion_corta }}</span>
          <span>{{ pedido.hora_entrega }}</span>
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-primario" @click="$router.push('/crear-receta')">Crear Nueva Receta</button>
      <button class="btn-primario">Imprimir</button>
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
.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; min-height: 250px; }
.encabezados-lista, .fila-orden { display: flex; justify-content: space-between; margin: 15px 0; font-family: serif; }
.mensaje-vacio { font-style: italic; color: #666; margin-top: 30px; font-family: serif;}
.botones-abajo { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-bottom: 20px; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; width: 200px; cursor: pointer; }
.clickeable { cursor: pointer; }
</style>