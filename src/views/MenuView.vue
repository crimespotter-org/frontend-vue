<template>
    <ion-page>
        <HeaderComponent />

        <ion-content class="case ion-padding">
            <ion-title>
                Hauptmenü
            </ion-title>
            <router-link to="/crime-map">
                <ion-item class="customTransparent"><ion-icon :icon="mapOutline" class="pr-4"></ion-icon>Karte
                    öffnen</ion-item>
            </router-link>
            <router-link to="/case-list">
                <ion-item class="customTransparent"><ion-icon :icon="folderOpenOutline" class="pr-4"></ion-icon>Liste
                    aller
                    Fälle</ion-item>
            </router-link>
            <router-link to="/create-case" v-if="isCrimefluencer"><ion-item class="customTransparent"><ion-icon
                        :icon="addOutline" class="pr-4"></ion-icon>Fall
                    hinzufügen</ion-item></router-link>
            <router-link to="/change-user-role" v-if="isAdmin"><ion-item class="customTransparent"><ion-icon
                        :icon="peopleOutline" class="pr-4"></ion-icon>Benutzerrollen
                    ändern</ion-item></router-link>
        </ion-content>
        <FooterComponent />
    </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonTitle, IonContent, IonItem } from '@ionic/vue';
import { Role } from "@/types/supabase-global";
import HeaderComponent from '../components/Header.vue';
import FooterComponent from '../components/Footer.vue';
import { currentUserInformation } from '@/services/currentUserInformation-service';
import { ref } from "vue";
import { addOutline, folderOpenOutline, peopleOutline, mapOutline } from "ionicons/icons";


const isAdmin = ref(false);
const isCrimefluencer = ref(false);

getCurrentUserRoleFromService();

async function getCurrentUserRoleFromService() {
    const currentUserRole: Role = await currentUserInformation.getCurrentUserRole();
    checkRole(currentUserRole);
}

function checkRole(currentUserRole: Role) {
    if (currentUserRole == "admin") {
        isAdmin.value = true;
        isCrimefluencer.value = true;
    }
    else if (currentUserRole == "crimefluencer") {
        isCrimefluencer.value = true;
    }
}

</script>