<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'

const router = useRouter()

// Variables para los campos de texto
const nombrePan = ref('')
const nuevoIngrediente = ref('')
const nuevoPaso = ref('')

// Arreglos donde se guardarán temporalmente las listas
const ingredientes = ref([])
const pasos = ref([])

// Funciones para agregar elementos a las listas en pantalla
const agregarIngrediente = () => {
  if (nuevoIngrediente.value.trim() !== '') {
    ingredientes.value.push(nuevoIngrediente.value)
    nuevoIngrediente.value = '' // Limpiamos el input
  }
}

const agregarPaso = () => {
  if (nuevoPaso.value.trim() !== '') {
    pasos.value.push(nuevoPaso.value)
    nuevoPaso.value = '' // Limpiamos el input
  }
}

// Función maestra para mandar todo a Firebase
const guardarReceta = async () => {
  if (!nombrePan.value || ingredientes.value.length === 0 || pasos.value.length === 0) {
    alert("Por favor, agrega un nombre, al menos un ingrediente y un paso.")
    return
  }

  try {
    // Creamos un nuevo documento en la colección "Recetas"
    await addDoc(collection(db, "Recetas"), {
      nombre: nombrePan.value,
      ingredientes: ingredientes.value,
      proceso: pasos.value
    })

    alert("¡Receta guardada con éxito en la base de datos!")
    router.push('/labores') // Regresamos a la pantalla principal
  } catch (error) {
    alert("Error al guardar la receta: " + error.message)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <h2 class="fuente-cursiva">Nueva Receta</h2>

      <div class="tarjeta-formulario">
        <!-- Nombre del Pan -->
        <input v-model="nombrePan" type="text" placeholder="Nombre del Pan (Ej. Torta Mediana)" class="input-linea titulo-input" />
        
        <hr class="separador">

        <!-- Sección Ingredientes -->
        <h5 class="subtitulo">Ingredientes</h5>
        <div class="grupo-agregar">
          <input v-model="nuevoIngrediente" type="text" placeholder="Ej. 250g Harina" class="input-linea" @keyup.enter="agregarIngrediente" />
          <button class="btn-mini" @click="agregarIngrediente">+</button>
        </div>
        <ul class="lista-previa">
          <li v-for="(ing, index) in ingredientes" :key="index">{{ ing }}</li>
        </ul>

        <hr class="separador">

        <!-- Sección Proceso -->
        <h5 class="subtitulo">Proceso de Elaboración</h5>
        <div class="grupo-agregar">
          <input v-model="nuevoPaso" type="text" placeholder="Ej. Precalentar horno a 180°C" class="input-linea" @keyup.enter="agregarPaso" />
          <button class="btn-mini" @click="agregarPaso">+</button>
        </div>
        <ol class="lista-previa">
          <li v-for="(paso, index) in pasos" :key="index">{{ paso }}</li>
        </ol>

      </div>

      <div class="botones-fila">
        <button class="btn-primario" @click="guardarReceta">Guardar Receta</button>
        <button class="btn-primario" @click="$router.push('/labores')">Cancelar</button>
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
.input-linea { background: transparent; border: none; border-bottom: 1px solid #333; padding: 5px; font-family: serif; width: 100%; outline: none; }
.titulo-input { font-size: 1.2rem; font-weight: bold; text-align: center; margin-bottom: 15px;}
.separador { border-top: 1px dashed #999; margin: 15px 0; }
.subtitulo { font-family: serif; font-size: 1.1rem; margin: 5px 0; }
.grupo-agregar { display: flex; gap: 10px; margin-bottom: 10px; }
.btn-mini { background-color: #cba344; color: white; border: none; border-radius: 5px; width: 30px; font-weight: bold; font-size: 1.2rem; cursor: pointer; }
.lista-previa { font-family: serif; font-size: 0.9rem; padding-left: 20px; margin: 0; color: #555; }
.botones-fila { display: flex; justify-content: space-evenly; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-family: serif;}
</style>