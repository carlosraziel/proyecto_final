<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore'

const router = useRouter()
const insumos = ref([])

// Variables para el formulario de ALTA
const nuevoProducto = ref('')
const nuevaCategoria = ref('')
const nuevasUnidades = ref(0)
const nuevoEstado = ref('Buen estado')

onMounted(() => {
  onSnapshot(collection(db, "Inventario"), (querySnapshot) => {
    const dataTemporal = []
    querySnapshot.forEach((doc) => {
      dataTemporal.push({ id: doc.id, ...doc.data() })
    })
    insumos.value = dataTemporal
  })
})

// Función para ALTA de insumos
const agregarInsumo = async () => {
  if (!nuevoProducto.value || !nuevaCategoria.value) {
    alert("Por favor, ingresa al menos el nombre y la categoría.")
    return
  }

  try {
    await addDoc(collection(db, "Inventario"), {
      producto: nuevoProducto.value,
      categoria: nuevaCategoria.value,
      unidades: nuevasUnidades.value,
      estado: nuevoEstado.value
    })
    
    // Limpiamos el formulario tras guardar
    nuevoProducto.value = ''
    nuevaCategoria.value = ''
    nuevasUnidades.value = 0
    nuevoEstado.value = 'Buen estado'
  } catch (error) {
    alert("Error al registrar insumo: " + error.message)
  }
}

// Función para BAJA de insumos
const darDeBaja = async (id) => {
  const confirmacion = confirm("¿Estás seguro de dar de baja este insumo permanentemente?")
  if (confirmacion) {
    try {
      await deleteDoc(doc(db, "Inventario", id))
    } catch (error) {
      alert("Error al eliminar: " + error.message)
    }
  }
}

// Función para actualizar unidades (entradas/salidas rápidas)
const actualizarUnidades = async (id, nuevasUnidades) => {
  try {
    const insumoRef = doc(db, "Inventario", id)
    await updateDoc(insumoRef, { unidades: nuevasUnidades })
  } catch (error) {
    console.error("Error al actualizar inventario:", error)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    <div class="contenido-central">
      <h2>Inventario de Panaderia Matriz</h2>

      <!-- Tarjeta para ALTA de Materia Prima -->
      <div class="tarjeta-inventario">
        <div class="etiqueta-estado ingreso">Ingreso de Materia Prima</div>
        
        <div class="formulario-alta">
          <input v-model="nuevoProducto" type="text" placeholder="Producto (Ej. Nuez)" class="input-linea" />
          <input v-model="nuevaCategoria" type="text" placeholder="Categoría" class="input-linea" />
          <input v-model="nuevasUnidades" type="number" placeholder="Unidades" class="input-linea input-corto" />
          <input v-model="nuevoEstado" type="text" placeholder="Estado" class="input-linea input-corto" />
          <button class="btn-mini-agregar" @click="agregarInsumo">+</button>
        </div>
      </div>

      <!-- Tarjeta de TABLA y BAJAS -->
      <div class="tarjeta-inventario">
        <div class="etiqueta-estado baja">Control y Bajas</div>
        
        <div class="contenedor-tabla">
          <table class="tabla-inventario">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Unidades</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="insumos.length === 0">
                <td colspan="5" class="texto-centro">No hay insumos registrados.</td>
              </tr>
              
              <tr v-for="insumo in insumos" :key="insumo.id">
                <td>{{ insumo.producto }}</td>
                <td>{{ insumo.categoria }}</td>
                <td>
                  <input 
                    type="number" 
                    v-model="insumo.unidades" 
                    @change="actualizarUnidades(insumo.id, insumo.unidades)"
                    class="input-tabla" 
                  />
                </td>
                <td>{{ insumo.estado }}</td>
                <td class="celda-accion">
                  <!-- Botón de BAJA -->
                  <button class="btn-eliminar" @click="darDeBaja(insumo.id)">X</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <button class="btn-primario" @click="$router.push('/')">Regresar</button>
    </div>
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-clara { background-color: #dcdcdc; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; flex-shrink: 0;}
.contenido-central { padding: 20px; text-align: center; color: #333; font-family: serif;}

.tarjeta-inventario { background: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; margin-bottom: 20px; text-align: left;}
.etiqueta-estado { display: inline-block; padding: 5px 15px; border-radius: 15px; border: 1px solid #333; margin-bottom: 15px; font-weight: bold;}
.ingreso { background-color: #a8e6cf; } 
.baja { background-color: #ffb3ba; } /* Color rojizo para la zona de bajas */

/* Estilos del formulario de alta */
.formulario-alta { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; justify-content: space-between;}
.input-linea { background: transparent; border: none; border-bottom: 1px solid #333; padding: 5px; font-family: serif; outline: none; flex-grow: 1; min-width: 120px;}
.input-corto { width: 80px; flex-grow: 0;}
.btn-mini-agregar { background-color: #cba344; color: white; border: none; border-radius: 5px; width: 35px; height: 35px; font-weight: bold; font-size: 1.2rem; cursor: pointer; }

/* Tabla */
.contenedor-tabla { overflow-x: auto; }
.tabla-inventario { width: 100%; border-collapse: collapse; text-align: left; background: #fff; min-width: 500px;}
.tabla-inventario th, .tabla-inventario td { border: 1px solid #999; padding: 10px; }
.tabla-inventario th { background-color: #f4f4f4; text-align: center;}
.input-tabla { width: 100%; border: none; background: transparent; outline: none; text-align: center; font-family: serif; font-size: 1rem;}
.texto-centro { text-align: center; font-style: italic; color: #666;}
.celda-accion { text-align: center; }
.btn-eliminar { background: none; border: none; color: red; font-weight: bold; font-size: 1.2rem; cursor: pointer; }

.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; cursor: pointer; font-family: serif; font-weight: bold; margin-top: 10px;}
</style>