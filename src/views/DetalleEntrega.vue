<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { db } from '../firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()
const idDelPedido = route.params.id

const pedido = ref(null)
// Arreglo reactivo para los productos que el repartidor va a ajustar
const productos = ref([])

onMounted(async () => {
  const pedidoRef = doc(db, "Pedidos", idDelPedido)
  const pedidoSnap = await getDoc(pedidoRef)
  
  if (pedidoSnap.exists()) {
    pedido.value = pedidoSnap.data()
    
    // Si el pedido ya tiene productos detallados en Firebase, los cargamos.
    // Si no, improvisamos uno basándonos en la "descripción corta" para poder probarlo hoy.
    if (pedido.value.detalles_productos) {
      productos.value = pedido.value.detalles_productos
    } else {
      // Extraemos el número de la descripción (ej. "25" de "25 pzs torta mediana")
      const cantidadInicial = parseInt(pedido.value.descripcion_corta) || 1
      const nombreLimpio = pedido.value.descripcion_corta.replace(/[0-9]+ pzs /i, '')
      
      productos.value = [
        { nombre: nombreLimpio, cantidad: cantidadInicial }
      ]
    }
  }
})

// Funciones para los botones de ajuste
const sumar = (index) => {
  productos.value[index].cantidad++
}

const restar = (index) => {
  if (productos.value[index].cantidad > 0) {
    productos.value[index].cantidad--
  }
}

// Vue calcula el total automáticamente cada vez que una cantidad cambia
const totalPiezas = computed(() => {
  return productos.value.reduce((total, prod) => total + prod.cantidad, 0)
})

const guardarYContinuar = async () => {
  try {
    // Guardamos las cantidades finales en la base de datos
    const pedidoRef = doc(db, "Pedidos", idDelPedido)
    await updateDoc(pedidoRef, { 
      detalles_productos: productos.value,
      total_piezas_entregadas: totalPiezas.value
    })
    
    // Lo mandamos a la última pantalla (Firmas y Check-in)
    router.push(`/check-in/${idDelPedido}`)
  } catch (error) {
    alert("Error al guardar los cambios: " + error.message)
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

      <h4 class="subrayado">Entrega {{ pedido ? pedido.destino : 'Cargando...' }}</h4>

      <div class="tarjeta-lista contenedor-camioneta">
        <div class="fondo-reparto">REPARTO</div>
        
        <h5 class="titulo-seccion">Detalles de Productos</h5>
        
        <div class="tabla-productos">
          <div class="fila-header">
            <span>Producto</span> 
            <span>Cant.</span> 
            <span>Ajustar</span>
          </div>
          <hr>
          
          <!-- Ciclo dinámico para cada producto en el pedido -->
          <div v-for="(prod, index) in productos" :key="index" class="fila-producto">
            <span class="nombre-prod">{{ prod.nombre }}</span>
            <span class="cantidad-prod">{{ prod.cantidad }}</span>
            
            <div class="controles-ajuste">
              <button class="btn-restar" @click="restar(index)">-</button>
              <button class="btn-sumar" @click="sumar(index)">+</button>
            </div>
          </div>
        </div>

        <div class="total-piezas">
          Total de Piezas : {{ totalPiezas }}
        </div>
      </div>
    </div>

    <div class="botones-abajo">
      <button class="btn-secundario" @click="guardarYContinuar">Guardar Cambios y Continuar</button>
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

.subrayado { font-family: serif; font-size: 1.2rem; margin-bottom: 15px;}
.contenedor-camioneta { position: relative; overflow: hidden; }
.fondo-reparto { position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); font-size: 3.5rem; font-family: serif; color: rgba(0, 0, 0, 0.05); font-weight: bold; pointer-events: none; z-index: 0; }
.tarjeta-lista { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; position: relative; z-index: 1; text-align: left;}
.titulo-seccion { text-align: center; font-family: serif; font-size: 1.1rem; margin: 0 0 15px 0; border-bottom: 1px solid #333; padding-bottom: 5px;}

/* Tabla de ajuste */
.fila-header { display: flex; justify-content: space-between; align-items: center; font-family: serif; font-weight: bold; padding: 0 5px;}
.fila-producto { display: flex; justify-content: space-between; align-items: center; margin: 15px 0; font-family: serif; border-bottom: 1px dashed #ccc; padding-bottom: 10px;}
.nombre-prod { width: 50%; }
.cantidad-prod { width: 15%; text-align: center; font-size: 1.2rem;}
.controles-ajuste { display: flex; gap: 8px; width: 35%; justify-content: flex-end;}
.btn-restar, .btn-sumar { border: 1px solid #333; background: #fff; width: 35px; height: 35px; border-radius: 5px; font-weight: bold; font-size: 1.2rem; cursor: pointer;}
.btn-sumar { background: #cba344; }
.total-piezas { text-align: right; font-weight: bold; margin-top: 20px; font-family: serif; font-size: 1.1rem;}

.botones-abajo { display: flex; justify-content: center; margin: 20px 0; }
.btn-secundario { background-color: #fff; border: 2px solid #cba344; padding: 10px 30px; border-radius: 20px; font-weight: bold; cursor: pointer; width: 280px;}
</style>