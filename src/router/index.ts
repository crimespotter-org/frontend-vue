import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import Login from '../views/LoginView.vue';
import CaseProfileView from '../views/CaseProfileView.vue';
import CreateAccount from '../views/CreateAccountView.vue';
import Unauthorized from '../views/UnauthorizedView.vue';
import ChangeUserRoleView  from '../views/ChangeUserRoleView.vue';
import { supabase } from '@/services/supabase-service';

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
    path: '/change-user-role',
    name: 'ChangeUserRoleView',
    component: ChangeUserRoleView,
    meta: { requiresAuthentication: true}
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
    component: () => import('@/views/CrimeMapView.vue')
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
