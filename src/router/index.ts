import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import CrimeMapView from '@/views/CrimeMapView.vue';
import ChangeCaseView from '@/views/ChangeCaseView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/crime-map',
    name: 'CrimeMapView',
    component: CrimeMapView
  },
  {
    path: '/change-case/:caseId',
    name: 'ChangeCaseView',
    component: ChangeCaseView,
    props: true
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
