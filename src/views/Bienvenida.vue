<script setup>

</script>

<template>
  <div class="pantalla-fondo">
    <div class="barra-mostaza"></div>
    <div class="capa-oscura centro">
      
      <!-- Logo Central -->
      <div class="logo-principal">
        <p class="logo-small">PANADERÍA ARTESANAL EL</p>
        <h1 class="logo-main">OAXAQUEÑO</h1>
        <p class="logo-sub">SAMUEL CRUZ</p>
      </div>

      <!-- Botones de Empleados -->
      <div class="botones-container">
        <button class="btn-primario" @click="$router.push('/login')">Iniciar sesión</button>
        <button class="btn-secundario" @click="$router.push('/registro')">Crear Cuenta</button>
      </div>

      <!-- Botones de Administración / Mostrador -->
      <div class="accesos-rapidos">
        <p class="texto-divisor">--- Accesos Rápidos (Mostrador / Admin) ---</p>
        <button class="btn-admin" @click="$router.push('/crear-pedido')">🍞 Punto de Venta (Nuevo Pedido)</button>
        <button class="btn-admin" @click="$router.push('/inventario')">📦 Inventario General</button>
      </div>
      
    </div>
    <div class="barra-mostaza-footer"></div>
  </div>
</template>

<style scoped>
.pantalla-fondo { background-color: #dcdcdc; height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
.barra-mostaza, .barra-mostaza-footer { background-color: #cba344; height: 20px; width: 100%; flex-shrink: 0;}
.centro { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 40px; }

/* Logo */
.logo-principal { text-align: center; color: #333; }
.logo-small { font-size: 1rem; letter-spacing: 2px; margin: 0; font-family: sans-serif; font-weight: bold;}
.logo-main { font-size: 3.5rem; font-family: serif; margin: 5px 0; letter-spacing: 2px; }
.logo-sub { font-size: 1.1rem; letter-spacing: 4px; margin: 0; border-top: 1px solid #333; display: inline-block; padding-top: 5px; font-family: sans-serif;}

/* Botones Empleados */
.botones-container { display: flex; flex-direction: column; gap: 15px; width: 100%; align-items: center; }
.btn-primario { background-color: #f4f4f4; border: 1px solid #000; padding: 12px 40px; border-radius: 25px; width: 250px; cursor: pointer; font-family: serif; font-size: 1.1rem; font-weight: bold;}
.btn-secundario { background-color: #fff; border: 2px solid #cba344; padding: 12px 40px; border-radius: 25px; width: 250px; cursor: pointer; font-family: serif; font-size: 1.1rem; font-weight: bold;}

/* Accesos Rápidos */
.accesos-rapidos { display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 20px; }
.texto-divisor { font-family: sans-serif; font-size: 0.8rem; color: #666; margin-bottom: 5px; }
.btn-admin { background-color: #333; color: white; border: none; padding: 10px 20px; border-radius: 10px; width: 250px; cursor: pointer; font-family: sans-serif; font-size: 0.9rem; transition: background 0.3s; }
.btn-admin:hover { background-color: #555; }
</style>