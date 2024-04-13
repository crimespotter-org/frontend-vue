import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Login from "../views/LoginView.vue";
import CaseProfileView from "../views/CaseProfileView.vue";
import CreateAccount from "../views/CreateAccountView.vue";
import Unauthorized from "../views/UnauthorizedView.vue";
import ChangeUserRoleView from "../views/ChangeUserRoleView.vue";
import MenuView from "../views/MenuView.vue";
import { supabase } from "@/services/supabase-service";
import { currentUserInformation } from "@/services/currentUserInformation-service";

let localUser;
let localUserRole;

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
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
    component: ChangeUserRoleView,
    meta: { requiresAdminRole: true },
  },
  {
    path: "/menu",
    name: "Menu",
    component: MenuView,
    meta: { requiresAuthentication: true },
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
    meta: { requiresAuthentication: true },
  },
  {
    path: "/case-profile",
    name: "CaseProfile",
    component: CaseProfileView,
    meta: { requiresAuthentication: true },
  },
  {
    path: "/crime-map",
    component: () => import("@/views/CrimeMapView.vue"),
  },
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
