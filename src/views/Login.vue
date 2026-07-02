<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()
const correo = ref('')
const password = ref('')

const iniciarSesion = async () => {
  if (!correo.value || !password.value) {
    alert("Ingresa tu correo y contraseña")
    return
  }

  try {
    // 1. Validar credenciales 
    const userCredential = await signInWithEmailAndPassword(auth, correo.value, password.value)
    const user = userCredential.user

    // 2. Buscar el documento del usuario en la base de datos para saber su rol
    const docSnap = await getDoc(doc(db, "Usuarios", user.uid))
    
    if (docSnap.exists()) {
      const datosUsuario = docSnap.data()
      
      // 3. Enrutamiento inteligente basado en roles
      if (datosUsuario.rol === 'jefe_obrador') {
        router.push('/labores')
      } else if (datosUsuario.rol === 'repartidor') {
        router.push('/entregas') 
      }
    } else {
      alert("No se encontró el perfil en la base de datos.")
    }
  } catch (error) {
    alert("Credenciales incorrectas o error de conexión.")
  }
}
</script>

<template>
  <div class="pantalla-fondo">
    <div class="barra-mostaza"></div>
    <div class="capa-oscura centro">
      
      <div class="login-card">
        <div class="input-group">
          <label>Correo:</label>
          <input v-model="correo" type="email" />
        </div>
        
        <div class="logo-translucido">
          <h2>OAXAQUEÑO</h2>
        </div>

        <div class="input-group">
          <label>Contraseña:</label>
          <input v-model="password" type="password" />
        </div>
        
        <p class="link-olvido">¿Olvidaste tu contraseña?</p>
      </div>

      <div class="botones-container">
        <button class="btn-primario" @click="iniciarSesion">Iniciar sesión</button>
        <button class="btn-primario" @click="$router.push('/')">Salir</button>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.pantalla-fondo { background-color: #4a4a4a; height: 100vh; display: flex; flex-direction: column; }
.barra-mostaza { background-color: #cba344; height: 20px; width: 100%; }
.centro { justify-content: center; gap: 30px; display: flex; align-items: center; flex-direction: column; height: 100%;}
.login-card { background-color: rgba(224, 224, 224, 0.85); border-radius: 15px; padding: 30px; width: 90%; max-width: 350px; text-align: center; position: relative; }
.input-group { margin: 20px 0; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1;}
.input-group label { font-size: 1.2rem; color: #333; }
.input-group input { background: transparent; border: none; border-bottom: 2px solid #555; width: 80%; padding: 5px; font-size: 1rem; text-align: center; outline: none; }
.logo-translucido h2 { font-family: serif; color: rgba(255, 255, 255, 0.6); font-size: 3rem; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 0; pointer-events: none; margin: 0;}
.link-olvido { margin-top: 20px; text-decoration: underline; cursor: pointer; position: relative; z-index: 1;}
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 10px 40px; border-radius: 20px; margin: 5px; cursor: pointer;}
</style>