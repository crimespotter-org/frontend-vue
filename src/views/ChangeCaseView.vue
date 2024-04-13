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
                        <ion-textarea ref="ionInputTitle" label="Title: " :value="detailCase[0].title"
                            rows="2"></ion-textarea>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="6">
                        <ion-item>
                            <ion-select aria-label="Fallstatus" placeholder="Fallstatus" :value="CaseStatus"
                                @ionChange="handleStatusChange">
                                <ion-select-option value="closed">Gelöst</ion-select-option>
                                <ion-select-option value="open">Ungelöst</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-col>
                    <ion-col size="6">
                        <ion-item>
                            <ion-select aria-label="Fallstatus" placeholder="Fallart" :value="CaseType"
                                @ionChange="handleCaseTypeChange">
                                <ion-select-option value="murder">Mord</ion-select-option>
                                <ion-select-option value="theft">Diebstahl</ion-select-option>
                                <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                                <ion-select-option value="brawl">Schlägerei</ion-select-option>
                                <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                            </ion-select>
                        </ion-item>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="12">
                        <ion-searchbar color="tertiary" autocomplete="on" @ion-change="getAddress"></ion-searchbar>
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col size="3">
                        <ion-fab>
                            <ion-fab-button id="open-modal">
                                <ion-icon :icon="calendarOutline"></ion-icon>
                            </ion-fab-button>
                        </ion-fab>
                    </ion-col>
                    <ion-col>
                        <ion-input ref="ionInputCrimeTime" :readonly="true" label="Tatzeit: "
                            :value="detailCase[0].crime_date_time"></ion-input>
                    </ion-col>
                </ion-row>
                <ion-row class="input-row">
                    <ion-col size="12">
                        <ion-textarea ref="ionInputSummary" label="Inhalt:" :value="detailCase[0].summary"
                            rows="16"></ion-textarea>
                    </ion-col>
                </ion-row>
            </ion-grid>
            <ion-button @click="updateCase">Update</ion-button>
            <ion-modal ref="modal" trigger="open-modal" :initial-breakpoint="0.75">
                <ion-header>
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
                        <ion-title>Filter</ion-title>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime display-format="YYYY-MM-DDTHH:mm:ssZ" v-model="SelectedDateTime"></ion-datetime>
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
    IonModal,
    IonSelect,
    IonSelectOption,
    IonItem,
    IonSearchbar
} from '@ionic/vue';
import { caseService } from '@/services/case-service';
import { calendarOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import { Case } from "@/types/supabase-global";

const dataLoaded = ref<boolean>(false);
const modal = ref();
const route = useRoute();
let detailCase: Case;
let SelectedDateTime: string;
let CaseType: string;
let CaseStatus: string;

const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeTime = ref();

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
    detailCase[0].crime_date_time = convertDateString(SelectedDateTime);
    ionInputCrimeTime.value.$el.value = detailCase[0].crime_date_time
    modal.value.$el.dismiss(null, 'cancel');
}

onMounted(async () => {
    const caseId = await route.params['caseId'].toString();
    detailCase = await caseService.getCase(caseId);
    detailCase[0].crime_date_time = convertDateString(detailCase[0].crime_date_time);
    CaseType = detailCase[0].case_type;
    CaseStatus = detailCase[0].status;
    setLocation();
    dataLoaded.value = true;
});

const setLocation = async() =>{

}

const updateCase = () => {
    /*caseService.updateCase(
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
    );*/
    console.log(CaseStatus);
    console.log(CaseType);
    console.log(ionInputTitle.value.$el.value);
};

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value;
};

const getAddress = (place: any) => {
    console.log('Address Object', place);
};

function convertDateString(inputDate: string): string {
    const date = new Date(inputDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}
</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}
</style>