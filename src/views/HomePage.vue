<template>
  <ion-page>


    <ion-content :fullscreen="true">
      <HeaderComponent />

      <div id="container">
        <p>{{ accountEmail }}</p>
        <strong>Ready to create an app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer"
            href="https://ionicframework.com/docs/components">UI Components</a></p>
        <ion-fab>
          <ion-fab-button tab="crime-map" href="/crime-map">
            Go To Map
          </ion-fab-button>
          <ion-fab-button tab="case-profile" color="warning">
            <router-link to="case-profile">
              Show case profile
            </router-link>
          </ion-fab-button>
        </ion-fab>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import HeaderComponent from '../components/Header.vue';
import { supabase } from '@/services/supabase-service';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton } from '@ionic/vue';
import { ref } from "vue";



const accountEmail = ref<any>();
getSession();


async function getSession() {

  const { data: { user } } = await supabase.auth.getUser();
  accountEmail.value = user?.email;

}
</script>
