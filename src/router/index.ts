import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/LoginView.vue';
import CaseProfileView from '../views/CaseProfileView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',  
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/case-profile',
    name: 'CaseProfileView',
    component: CaseProfileView
  },
  {
    path: '/crime-map',
    component: () => import('@/views/CrimeMapView.vue')
  },  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
