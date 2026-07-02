<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const router = useRouter()

const nombre = ref('')
const correo = ref('')
const password = ref('')
const cargo = ref('jefe_obrador') // Valor por defecto

const registrarUsuario = async () => {
  if (!correo.value || !password.value || !nombre.value) {
    alert("Por favor llena todos los campos obligatorios")
    return
  }

  try {
    // 1. Crear el usuario en el sistema de autenticación de Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, correo.value, password.value)
    const user = userCredential.user

    // 2. Guardar su perfil y ROL en la base de datos (Firestore)
    await setDoc(doc(db, "Usuarios", user.uid), {
      uid: user.uid,
      nombre: nombre.value,
      rol: cargo.value
    })

    alert("¡Cuenta creada exitosamente!")
    router.push('/login') // Lo mandamos a iniciar sesión

  } catch (error) {
    alert("Error al crear cuenta: " + error.message)
  }
}
</script>

<template>
  <div class="pantalla-clara">
    <div class="barra-mostaza"></div>
    
    <div class="contenido-central">
      <h2 class="fuente-cursiva">Bienvenido</h2>
      <h3>Datos Personales</h3>

      <div class="tarjeta-formulario">
        <div class="columna-izq">
          <!-- Conectamos los inputs a las variables con v-model -->
          <input v-model="nombre" type="text" placeholder="Nombre completo" class="input-linea" />
          <input v-model="correo" type="email" placeholder="Correo electrónico" class="input-linea" />
          <input v-model="password" type="password" placeholder="Contraseña (mín 6 letras)" class="input-linea" />
          
          <select v-model="cargo" class="input-select">
            <option value="jefe_obrador">Jefe Obrador</option>
            <option value="repartidor">Repartidor</option>
          </select>
        </div>

        <div class="columna-der">
          <div class="horario-box">
            <p>Horario de Inicio</p>
            <span class="texto-gris">Por definir</span>
          </div>
          <div class="horario-box">
            <p>Horario de Salida</p>
            <span class="texto-gris">Por definir</span>
          </div>
        </div>
      </div>

      <div class="botones-fila">
        <!-- Disparamos la función al hacer clic -->
        <button class="btn-primario" @click="registrarUsuario">Guardar</button>
        <button class="btn-primario" @click="$router.push('/')">Salir</button>
      </div>
    </div>
    
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>

.pantalla-clara { background-color: #dcdcdc; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; }
.contenido-central { padding: 20px; text-align: center; color: #333; }
.fuente-cursiva { font-family: 'Brush Script MT', cursive; font-size: 2rem; }
.tarjeta-formulario { background-color: #ebebeb; border: 1px solid #999; border-radius: 15px; padding: 20px; display: flex; justify-content: space-between; margin-bottom: 20px; }
.columna-izq { display: flex; flex-direction: column; gap: 15px; width: 50%; }
.columna-der { width: 45%; display: flex; flex-direction: column; justify-content: space-around;}
.input-linea { background: transparent; border: none; border-bottom: 1px solid #333; padding: 5px; font-family: serif; outline: none; }
.input-linea::placeholder { color: #555; }
.input-select { background: transparent; border: 1px solid #333; border-radius: 15px; padding: 5px; outline: none;}
.horario-box p { margin: 0; font-family: serif; }
.texto-gris { color: #888; font-family: serif;}
.botones-fila { display: flex; justify-content: space-evenly; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 30px; border-radius: 20px; cursor: pointer;}
</style>