<template>
  <ion-header>
    <ion-toolbar color="primary">
      <ion-avatar class="ion-float-left custom-margin">
        <router-link to="/home">
          <ion-img src="../../public/Logo-CrimeSpotter.png" alt="Logo CrimeSpotter"></ion-img>
        </router-link>
      </ion-avatar>


      <div class="custom-margin-vertikal">
        <ion-button @click="logout" class="custom-button ion-float-right">
          <ion-icon :icon="logOutOutline" />
        </ion-button>
      </div>


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

<style scoped>
.custom-button {
  --background: red;
  --box-shadow: none;

}

.custom-margin {
  margin: 5px 5px 5px 5px;
}

.custom-margin-vertikal {
  display: flex; /* Verwenden Sie Flexbox */
  align-items: center; /* Vertikal zentrieren */
  margin-right: 5px;
}

</style>