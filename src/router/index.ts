import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import Login from "../views/LoginView.vue";
import CreateAccount from "../views/CreateAccountView.vue";
import Unauthorized from "../views/UnauthorizedView.vue";
import ChangeUserRole from "../views/ChangeUserRoleView.vue";
import Menu from "../views/MenuView.vue";
import CrimeMap from "../views/CrimeMapView.vue";
import ChangeCase from "../views/ChangeCaseView.vue";
import { currentUserInformation } from "@/services/currentUserInformation-service";

let localUser;
let localUserRole;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/crime-map",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/create-Account",
    name: "CreateAccount",
    component: CreateAccount,
  },
  {
    path: "/unauthorized",
    name: "Unauthorized",
    component: Unauthorized,
  },
  {
    path: "/change-user-role",
    name: "ChangeUserRole",
    component: ChangeUserRole,
    meta: { requiresAdminRole: true },
  },
  {
    path: "/change-case/:id",
    name: "ChangeCase",
    component: ChangeCase,
    meta: { requiresCrimeFluencerRole: true },
  },
  {
    path: "/menu",
    name: "Menu",
    component: Menu,
    meta: { requiresAuthentication: true },
  }, 
  {
    path: "/crime-map",
    name: "CrimeMap",
    component: CrimeMap,
    meta: { requiresAuthentication: true },
  }  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

async function getUser(next) {
  localUser = await currentUserInformation.getCurrentUser();
  if (localUser.data.session == null) {
    next("/unauthorized");
  } else {
    next();
  }
}

async function getInformationAboutAdminRole(next) {
  localUserRole = await currentUserInformation.getCurrentUserRole();
  if (localUserRole == "admin") {
    next();
  } else {
    next("/unauthorized");
  }
}

async function getInformationAboutCrimeFluencerRole(next) {
  localUserRole = await currentUserInformation.getCurrentUserRole();
  if (localUserRole == "crimespotter") {
    next();
  } else if (localUserRole == "admin") {
    next();
  } else {
    next("/unauthorized");
  }
}

//authentication is required
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuthentication) {
    getUser(next);
  } else if (to.meta.requiresAdminRole) {
    getInformationAboutAdminRole(next);
  } else if (to.meta.requiresCrimeFluencerRole) {
    getInformationAboutCrimeFluencerRole(next);
  } else {
    next();
  }
});

export default router;
