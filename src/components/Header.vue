<template>
  <ion-header>
    <ion-toolbar color="primary">
      <!-- Logo auf der linken Seite -->
      <ion-avatar>
        <ion-icon :icon="homeOutline" />
      </ion-avatar>

      <!-- Titel oder andere Inhalte in der Mitte -->
      <ion-title>Meine App</ion-title>

      <!-- Logout-Symbol auf der rechten Seite -->
      <ion-buttons>
        <ion-button @click="logout">
          <ion-icon :icon="logOutOutline" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup>
import { ref } from 'vue';
import { IonHeader, IonToolbar, IonTitle, IonAvatar, IonButton, IonIcon, IonButtons } from '@ionic/vue';
import { logOutOutline, homeOutline } from 'ionicons/icons';


//Logout  function
async function logout() {

  const { error } = await supabase.auth.signOut();
  console.log("Logged out");

  if (error) {
    console.log(error)
  }
}

</script>