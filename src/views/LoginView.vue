<template>
    <ion-page>
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="login-form">
          <ion-item>
            <ion-label position="floating" aria-label="email">E-Mail-Adresse</ion-label>
            <ion-input type="email" id="email" v-model="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" aria-label="password">Passwort</ion-label>
            <ion-input type="password" id="password" v-model="password"></ion-input>
          </ion-item>
          <ion-button expand="full" >Anmelden</ion-button>
        </div>

        <div class="buttonContainer">
            <ion-button @click="createAccount">Account erstellen</ion-button>
            <ion-button @click="login">Login-Seite</ion-button>
            <ion-button @click="seeCurrentUser">Benutzer anzeigen</ion-button>
            <ion-button @click="logout">Logout</ion-button>
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
import { ref } from "vue";


//variable email and password
let email = ref("");
let password = ref("");


//Function for creating an account
function createAccount() {
    console.log("Create Account")
}

//Login
function login() {
    console.log("Login")
}


//Shows details from current user
function seeCurrentUser() {
    console.log("See Current User")
}

//Logout  function
function logout() {
    console.log("Logged out")
}



</script>
