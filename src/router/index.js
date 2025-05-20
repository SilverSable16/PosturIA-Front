import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

let routes = [
  {
    // Ruta para manejar cualquier error 404
    path: '*',
    component: () => import('../views/404.vue'),
  },
  {
    path: '/',
    name: 'Home',
    redirect: '/sign-in', // Redirige automáticamente a la página de login
  },
  {
	path: '/detector',
	name: 'Detector',
	layout: "dashboard", // Esto indica que se usará el layout del Dashboard
	component: () => import('../views/Detector.vue'),
  }
  ,
  {
    path: '/diagnostico',
	name: 'Diagnostico',
    layout: "dashboard",
    component: () => import('../views/Diagnostico.vue'),
  },
  {
    path: '/ejercicios',
	name: 'Ejercicios',
    layout: "dashboard",
    component: () => import('../views/Ejercicios.vue'),
  },
  {
    path: '/rtl',
    name: 'RTL',
    layout: "dashboard-rtl",
    meta: {
      layoutClass: 'dashboard-rtl',
    },
    component: () => import('../views/RTL.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    layout: "dashboard",
    meta: {
      layoutClass: 'layout-profile',
    },
    component: () => import('../views/Profile.vue'),
  },
  {
    path: '/sign-in',
    name: 'Sign-In',
    component: () => import('../views/Sign-In.vue'),
  },
  {
    path: '/sign-up',
    name: 'Sign-Up',
    meta: {
      layoutClass: 'layout-sign-up',
    },
    component: () => import('../views/Sign-Up.vue'),
  },
]

// Aseguramos que cada ruta tenga un layout predeterminado, si no se asigna uno
function addLayoutToRoute(route, parentLayout = "default") {
  route.meta = route.meta || {}
  route.meta.layout = route.layout || parentLayout

  if (route.children) {
    route.children = route.children.map((childRoute) => addLayoutToRoute(childRoute, route.meta.layout))
  }
  return route
}

routes = routes.map((route) => addLayoutToRoute(route))

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash,
        behavior: 'smooth',
      }
    }
    return {
      x: 0,
      y: 0,
      behavior: 'smooth',
    }
  }
})

export default router
