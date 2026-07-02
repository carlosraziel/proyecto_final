import { createRouter, createWebHistory } from 'vue-router'
import Bienvenida from '../views/Bienvenida.vue'
import Login from '../views/Login.vue'
import Labores from '../views/Labores.vue'
import Registro from '../views/Registro.vue'
import Instrucciones from '../views/Instrucciones.vue'
import CrearReceta from '../views/CrearReceta.vue'
import Entregas from '../views/Entregas.vue'
import Escaner from '../views/Escaner.vue'
import DetalleEntrega from '../views/DetalleEntrega.vue'
import CheckIn from '../views/CheckIn.vue'
import CrearPedido from '../views/CrearPedido.vue'
import Inventario from '../views/Inventario.vue'

const routes = [
  { path: '/', component: Bienvenida },
  { path: '/login', component: Login },
  { path: '/labores', component: Labores },
  { path: '/registro', component: Registro },
  { path: '/instrucciones/:id', component: Instrucciones },
  { path: '/crear-receta', component: CrearReceta },
  { path: '/entregas', component: Entregas },
  { path: '/escaner/:id', component: Escaner },
  { path: '/detalle-entrega/:id', component: DetalleEntrega },
  { path: '/check-in/:id', component: CheckIn },
  { path: '/crear-pedido', component: CrearPedido },
  { path: '/inventario', component: Inventario }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router