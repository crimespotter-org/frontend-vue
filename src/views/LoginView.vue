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
                <ion-button expand="full" @click="login">Anmelden</ion-button>
            </div>

            <div class="buttonContainer">
                <ion-button @click="createAccount">Account erstellen</ion-button>
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
import { supabase } from "@/services/supabase-service";


//variable email and password
let email = ref("");
let password = ref("");


//Function for creating an account
async function createAccount() {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value
        });

        console.log("Create Account")

    } catch (error) {
        console.log(error)
    }
}

//Login
async function login() {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        });

        console.log("Logged in")

    } catch (error) {
        console.log(error)
    }
}


//Shows details from current user
async function seeCurrentUser() {
    try {
        const localUser = await supabase.auth.getSession();

        console.log(localUser);

    } catch (error) {
        console.log(error)
    }
}

//Logout  function
async function logout() {
    try {
        const { error } = await supabase.auth.signOut();      
        console.log("Logged out");

    } catch (error) {
        console.log(error)
    }
}



</script>
