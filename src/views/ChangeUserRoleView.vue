<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Benutzerrollen ändern</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Benutzerrollen ändern</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <ion-item v-if="isAdmin">
          <ion-label position="floating">Benutzer auswählen</ion-label>
          <ion-select v-model="selectedUser" interface="action-sheet">
            <ion-select-option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-item v-if="isAdmin">
          <ion-label position="floating">Neue Rolle auswählen</ion-label>
          <ion-select v-model="selectedRole" interface="action-sheet">
            <ion-select-option v-for="role in roles" :key="role" :value="role">{{ role }}</ion-select-option>
          </ion-select>
        </ion-item>
  
        <ion-button v-if="isAdmin" @click="changeUserRole">Rolle ändern</ion-button>
        
        <div v-else>
          <ion-text color="danger">Diese Aktion erfordert Administratorberechtigungen.</ion-text>
        </div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonText } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { Role } from "@/types/supabase-global"; // Stellen Sie sicher, dass dies auf Ihren Typenpfad verweist
  
  export default defineComponent({
    components: {
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonItem,
      IonLabel,
      IonSelect,
      IonSelectOption,
      IonButton,
      IonText
    },
    data() {
      return {
        isAdmin: true, // Simulierter Wert für Administrationsberechtigung
        users: [
          { id: 1, name: 'Benutzer 1' },
          { id: 2, name: 'Benutzer 2' },
          { id: 3, name: 'Benutzer 3' }
        ], // Annahme: Liste der Benutzer
        roles: [Role.Admin, Role.User, Role.Guest], // Annahme: Liste der Rollen
        selectedUser: null, // Benutzer, dessen Rolle geändert werden soll
        selectedRole: null // Neue Rolle für den Benutzer
      };
    },
    methods: {
      changeUserRole() {
        if (this.selectedUser && this.selectedRole) {
          // Simulierte Funktion zum Ändern der Benutzerrolle
          console.log(`Die Rolle von Benutzer ${this.selectedUser} wurde auf ${this.selectedRole} geändert.`);
        } else {
          console.error('Bitte wählen Sie einen Benutzer und eine Rolle aus.');
        }
      }
    }
  });
  </script>
  
  <style scoped>
  /* Ihre Stile hier */
  </style>
  