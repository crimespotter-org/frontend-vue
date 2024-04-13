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
                <router-link to="/create-Account"> <ion-button>Account erstellen</ion-button>  </router-link>              
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
import router from '../router'

//variable email and password
let email = ref("");
let password = ref("");


//Login
async function login() {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });
    if (!error) {
        router.push('/crime-map');
    } else {
        console.log("Dasn sit err" + error)
    }



}


//Shows details from current user
async function seeCurrentUser() {
    
        const localUser = await supabase.auth.getSession();

        console.log(localUser);

}

//Logout  function
async function logout() {
    
        const { error } = await supabase.auth.signOut();
        console.log("Logged out");

    if (error) {
        console.log(error)
    }
}



</script>
