<template>
    <ion-page v-if="dataLoaded">
        <ion-header>
            <ion-toolbar class="crimeHeader">
                <ion-title>Case Bearbeiten</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-grid>
                <ion-row class="input-row">
                    <ion-col size="12">
                        <ion-textarea label="Title: " :value="detailCase[0].title" rows="2"></ion-textarea>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="6">
                        <ion-input label="Fallstatus: "  :value="detailCase[0].status"></ion-input>
                    </ion-col>
                    <ion-col size="5">
                        <ion-input label="Mordart: " :value="detailCase[0].case_type"></ion-input>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="5">
                        <ion-input label="Ort: "></ion-input>
                    </ion-col>
                    <ion-col>
                        <ion-input label="Tatzeit: "  :value="detailCase[0].crime_date_time"></ion-input>
                    </ion-col>
                    <ion-col size="2">
                        <ion-fab>
                            <ion-fab-button id="open-modal">
                                <ion-icon :icon="calendarOutline"></ion-icon>
                            </ion-fab-button>
                        </ion-fab>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="12" >
                        <ion-textarea label="Inhalt:" :value="detailCase[0].summary" rows="16"></ion-textarea>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-button @click="updateCase">Update</ion-button>
            <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.75">
                <ion-header>
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="cancel()" slot="end">Anwenden</ion-button>
                        <ion-title>Filter</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime></ion-datetime>
                </ion-content>
            </ion-modal>
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">

import { ref, onMounted } from "vue";
import { 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonPage,
    IonInput,
    IonTextarea,
    IonDatetime,
    IonFab, 
    IonFabButton, 
    IonIcon,
    IonModal
 } from '@ionic/vue';
import {caseService} from '@/services/case-service'; 
import { calendarOutline} from "ionicons/icons";
import {useRoute} from "vue-router";
import { Case } from "@/types/supabase-global";

const dataLoaded = ref<boolean>(false);
const modal = ref();
const route = useRoute();
let detailCase: Case;

const cancel = () =>{
  modal.value.$el.dismiss(null, 'cancel');
} 

onMounted(async () => {
    const caseId = await route.params['caseId'].toString();
    detailCase = await caseService.getCase(caseId);
    dataLoaded.value = true;
});



const updateCase = () => {
    caseService.updateCase(
        "713af3b1-16cf-4a44-893d-5280f1fbfbd9",
        "robbery-murder",
        "28.12.2000",
        "emma.weiss2000@gmail.com",
        48.457675,
        8.697503,
        "Horb",
        "open",
        "Inmitten des geschäftigen Treibens eines Döner-Imbisses entstand plötzlich ein hitziger Streit zwischen einem Angestellten und einem türkischen Gast. Die Situation eskalierte rasch, als der Angestellte offenbar ein Messer zog und dem Gast mehrere Stiche zufügte. Spekulationen über die Tatwaffe sorgten für Aufsehen - soll es wirklich das Döner-Messer gewesen sein? Eine Frage, die die Gemüter zusätzlich erhitzte. Die Polizei rückte daraufhin zum Tatort vor einem Einkaufsmarkt aus, wo sich ein bedrückendes Szenario entfaltete. Real-Mitarbeiter versuchten hektisch, den Bereich abzusperren, während verzweifelte Angehörige des Opfers von Emotionen überwältigt waren. Der Ruf Hurensohn durchdrang die Luft, während die Beamten mühevoll versuchten, die Gemüter zu beruhigen und weitere Zwischenfälle zu verhindern. Währenddessen kämpfte die Mutter des Opfers im Krankenhaus um Fassung, während der Vater verzweifelt versuchte, einen letzten Blick auf seinen Sohn zu erhaschen. Die Szenerie war geprägt von Trauer und Unverständnis, während Real-Mitarbeiter und Seelsorger versuchten, die Lage zu beruhigen und erste Informationen zu sammeln. Im Laufe der Nacht kehrte langsam Ruhe ein, während die Polizei mit den Ermittlungen begann und die Hintergründe dieser tragischen Tat zu ergründen versuchte. In einem Bestattungshaus in Albstadt wartete der Leichnam des Opfers darauf, seine letzte Ruhe zu finden. Doch die Geschichte endet nicht hier - sie hinterließ drei kleine Kinder, deren Zukunft nun im Schatten dieser Tragödie liegt.",
        "Tödliche Messerstecherei am Döner-Stand",
        72160
    );
};

</script>

<style scoped>
.input-row {
  margin-bottom: 20px;
}
</style>