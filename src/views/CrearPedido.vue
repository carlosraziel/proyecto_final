<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const router = useRouter()

// Datos generales del pedido
const destino = ref('')
const horaEntrega = ref('')

// Lista de productos que se van agregando
const productos = ref([])
const nuevoProducto = ref('')
const nuevaCantidad = ref(1)

const agregarProducto = () => {
  if (nuevoProducto.value.trim() !== '' && nuevaCantidad.value > 0) {
    productos.value.push({
      nombre: nuevoProducto.value,
      cantidad: nuevaCantidad.value
    })
    nuevoProducto.value = ''
    nuevaCantidad.value = 1
  }
}

const quitarProducto = (index) => {
  productos.value.splice(index, 1)
}


const descripcionCorta = computed(() => {
  if (productos.value.length === 0) return ''
  const primerProd = productos.value[0]
  const extra = productos.value.length > 1 ? ` y ${productos.value.length - 1} más` : ''
  return `${primerProd.cantidad} pzs ${primerProd.nombre}${extra}`
})

const enviarPedido = async () => {
  if (!destino.value || !horaEntrega.value || productos.value.length === 0) {
    alert("Faltan datos en el pedido.")
    return
  }

  try {
    await addDoc(collection(db, "Pedidos"), {
      destino: destino.value,
      hora_entrega: horaEntrega.value,
      descripcion_corta: descripcionCorta.value,
      detalles_productos: productos.value,
      estado: "preparando" 
    })
    
    alert("¡Pedido enviado a cocina!")
    router.push('/') // O a un panel de administrador
  } catch (error) {
    alert("Error al crear pedido: " + error.message)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <h2 class="fuente-cursiva">Nuevo Pedido</h2>

      <div class="tarjeta-formulario">
        <!-- Datos del Cliente -->
        <div class="grupo-inputs">
          <input v-model="destino" type="text" placeholder="Cliente / Destino (Ej. Camino Viejo)" class="input-linea" />
          <input v-model="horaEntrega" type="time" class="input-linea" />
        </div>
        
        <hr class="separador">

        <!-- Agregar Productos -->
        <h5 class="subtitulo">Agregar Productos</h5>
        <div class="grupo-agregar">
          <input v-model="nuevaCantidad" type="number" min="1" class="input-linea cant-input" />
          <input v-model="nuevoProducto" type="text" placeholder="Ej. Torta Mediana" class="input-linea prod-input" @keyup.enter="agregarProducto" />
          <button class="btn-mini" @click="agregarProducto">+</button>
        </div>


        <ul class="lista-previa">
          <li v-for="(prod, index) in productos" :key="index">
            {{ prod.cantidad }}x {{ prod.nombre }}
            <button class="btn-quitar" @click="quitarProducto(index)">x</button>
          </li>
        </ul>
      </div>

      <div class="botones-fila">
        <button class="btn-primario" @click="enviarPedido">Enviar a Cocina</button>
        <button class="btn-primario" @click="$router.push('/')">Regresar</button>
      </div>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; }
.contenido-central { padding: 20px; text-align: center; color: #333; }
.fuente-cursiva { font-family: 'Brush Script MT', cursive; font-size: 2.5rem; margin-top: 0; }
.tarjeta-formulario { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; text-align: left; margin-bottom: 20px; }
.grupo-inputs { display: flex; flex-direction: column; gap: 15px; }
.input-linea { background: transparent; border: none; border-bottom: 1px solid #333; padding: 5px; font-family: serif; width: 100%; outline: none; }
.separador { border-top: 1px dashed #999; margin: 15px 0; }
.subtitulo { font-family: serif; font-size: 1.1rem; margin: 5px 0; }
.grupo-agregar { display: flex; gap: 10px; margin-bottom: 10px; align-items: center;}
.cant-input { width: 20%; text-align: center; }
.prod-input { width: 65%; }
.btn-mini { background-color: #cba344; color: white; border: none; border-radius: 5px; width: 30px; height: 30px; font-weight: bold; font-size: 1.2rem; cursor: pointer; }
.lista-previa { font-family: serif; font-size: 1rem; padding-left: 0; list-style: none; margin: 0; color: #333; }
.lista-previa li { display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #ccc;}
.btn-quitar { background: none; border: none; color: red; font-weight: bold; cursor: pointer; font-size: 1.1rem;}
.botones-fila { display: flex; justify-content: center; gap: 20px; margin-top: 15px;}
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; cursor: pointer; font-family: serif; font-weight: bold;}
</style>