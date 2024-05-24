<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Unauthorisiert</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="unauthorized-view">
        <p>Du bist nicht berechtigt.</p>
        <p>Bitte melde dich an, um fortzufahren.</p>
        <ion-button class="mt-4">
          <router-link to="login">Zur Anmeldung</router-link>
        </ion-button>
        <div class="buttonContainer">
          <router-link to="/create-Account"> <ion-button>Account erstellen</ion-button> </router-link>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonPopover,
  modalController,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption
} from "@ionic/vue";
import { supabase } from "@/services/supabase-service";

logout();


//Logout  function
async function logout() {

  const { error } = await supabase.auth.signOut();
}

</script>
