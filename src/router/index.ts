import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/LoginView.vue';
import CaseProfileView from '../views/CaseProfileView.vue';
import CreateAccount from '../views/CreateAccountView.vue';
import Unauthorized from '@/views/UnauthorizedView.vue';
import { supabase } from '@/services/supabase-service';
import CrimeMapView from '@/views/CrimeMapView.vue';
import ChangeCaseView from '@/views/ChangeCaseView.vue';

let localUser;



const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',  
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/create-Account',
    name: 'CreateAccount',
    component: CreateAccount
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: Unauthorized
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuthentication: true}
  },
  {
    path: '/case-profile',
    name: 'CaseProfileView',
    component: CaseProfileView,
    meta: { requiresAuthentication: true}
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

//get user information
async function getUser(next) {
  localUser = await supabase.auth.getSession();
  if (localUser.data.session == null) {
    next("/unauthorized");
  } else {
    next();
  }
}

//authentication is required
router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuthentication) {
    getUser(next)
    console.log("Authentication required"); 
  } else {
    next();
  }

})




export default router
