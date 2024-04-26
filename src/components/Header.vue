<template>
  <ion-header>
    <ion-toolbar color="primary flex flex-row justify-between">
      <div class="flex justify-between">
        <div class="p-3"> 
          <ion-avatar>
            <router-link to="/home">
              <ion-img src="../../public/Logo-CrimeSpotter.png" alt="Logo CrimeSpotter"></ion-img>
            </router-link>
          </ion-avatar>
        </div>

        <div class="py-4 pr-2">
          <ion-button @click="logout" class="custom-button">
            <ion-icon size="large" :icon="logOutOutline" />
          </ion-button>
        </div>
      </div>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { IonHeader, IonToolbar, IonAvatar, IonButton, IonIcon } from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { supabase } from "@/services/supabase-service";
import router from '../router'


//Logout  function
async function logout() {

  const { error } = await supabase.auth.signOut();
  console.log("Logged out");

  if (!error) {
    router.push('/login');
  }
}

</script>

<style scoped>
.custom-button {
  --background: transparent;
  --box-shadow: none;
}
</style>