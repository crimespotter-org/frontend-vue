<template>
    <ion-page>
        <HeaderComponent />

        <ion-content class="case">
            <ion-title>
                Hauptmenü
            </ion-title>
            <ion-item class="customTransparent"><ion-icon :icon="arrowForwardOutline"></ion-icon>  Liste aller
                Fälle</ion-item>
            <router-link to="/create-case" v-if="isCrimefluencer"><ion-item class="customTransparent"><ion-icon
                        :icon="arrowForwardOutline"></ion-icon>  Fall
                    hinzufügen</ion-item></router-link>
            <router-link to="/change-user-role" v-if="isAdmin"><ion-item class="customTransparent"><ion-icon
                        :icon="arrowForwardOutline"></ion-icon>  Benutzerrollen
                    ändern</ion-item></router-link>
        </ion-content>
    </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from '@ionic/vue';
import { Role } from "@/types/supabase-global";
import HeaderComponent from '../components/Header.vue';
import { currentUserInformation } from '@/services/currentUserInformation-service';
import { onMounted, ref } from "vue";
import { arrowForwardOutline } from "ionicons/icons";


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