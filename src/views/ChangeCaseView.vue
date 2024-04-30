<template>
    <ion-page v-if="dataLoaded">
        <HeaderComponent />
        <ion-content class="ion-padding">
            <ion-toolbar>
                <ion-segment v-model="segment">
                    <ion-segment-button value="info">
                        <ion-label>Info</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="picture">
                        <ion-label>Bilder</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="links">
                        <ion-label>Links</ion-label>
                    </ion-segment-button>
                </ion-segment>
            </ion-toolbar>
            <ion-card v-show="segment === 'info'">
                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-card>

                            </ion-card>
                        </ion-col>
                    </ion-row>
                    <ion-row class="input-row">
                        <ion-col size="12">
                            <ion-textarea ref="ionInputTitle" label="Title: "
                                :value="detailCase[0].title"></ion-textarea>
                        </ion-col>
                    </ion-row>
                    <ion-row class="input-row">
                        <ion-col size="12">
                            <ion-textarea ref="ionInputSummary" label="Inhalt:" :value="detailCase[0].summary"
                                rows="16"></ion-textarea>
                        </ion-col>
                    </ion-row>
                    <ion-row class="input-row">
                        <ion-col size="6">
                            <ion-item>
                                <ion-select aria-label="Fallstatus" label="Fallstatus" label-placement="floating"
                                    fill="solid" :value="CaseStatus" @ionChange="handleStatusChange">
                                    <ion-select-option value="closed">Gelöst</ion-select-option>
                                    <ion-select-option value="open">Ungelöst</ion-select-option>
                                </ion-select>
                            </ion-item>
                        </ion-col>
                        <ion-col size="6">
                            <ion-item>
                                <ion-select label="Straftat" label-placement="floating" fill="solid"
                                    aria-label="Straftat" :value="CaseType" @ionChange="handleCaseTypeChange">
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
                            <div v-if="showComponent">
                                <ion-searchbar color="tertiary" autocomplete="on" @ion-change="getAddress"
                                    @ion-focus="setLocation" :value="PlaceName">
                                </ion-searchbar>
                            </div>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col size="3">
                            <ion-fab>
                                <ion-fab-button @click="onCalenderClickEvent" color="secondary">
                                    <ion-icon :icon="calendarOutline"></ion-icon>
                                </ion-fab-button>
                            </ion-fab>
                        </ion-col>
                        <ion-col>
                            <ion-input ref="ionInputCrimeDate" :readonly="true" label="Tatdatum: "
                                :value="CrimeDate"></ion-input>
                            <ion-input ref="ionInputCrimeTime" :readonly="true" label="Tatzeit: "
                                :value="CrimeTime"></ion-input>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                            @didDismiss="setOpen(false)"></ion-toast>
                    </ion-row>
                    <ion-row>
                        <ion-col size="3">
                            <ion-button @click="updateCase">Update</ion-button>
                        </ion-col>
                        <ion-col size="5">
                        </ion-col>
                        <ion-col size="4">
                            <ion-button @click="navigateBack">Zurück</ion-button>
                        </ion-col>
                    </ion-row>
                </ion-grid>
            </ion-card>
            <ion-card v-if="pictureLoaded" v-show="segment === 'picture'">
                <ion-card-content>
                    <ion-list>
                        <ion-item v-for="(pic, index) of picture" :key="index">
                            <ion-thumbnail slot="start">
                                <ion-img alt="Hier sollte ein Bild sein" :src=pic.pictureUri />
                            </ion-thumbnail>
                            <ion-label>{{ pic.imageName }}</ion-label>
                            <ion-button @click="deletePicture(pic)">
                                <ion-icon :icon="trashOutline"></ion-icon>
                            </ion-button>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
                <ion-button @click="takePicture">
                    <ion-icon :icon="cameraOutline"></ion-icon>
                </ion-button>
                <ion-button @click="getPicture">
                    <ion-icon :icon="imageOutline"></ion-icon>
                </ion-button>
            </ion-card>
            <ion-card v-show="segment === 'links'">
                <ion-card-content>
                    Updaten über den Update Button auf der Info Seite!
                    <ion-list>
                        <ion-item v-for="(link, index) in linkList" :key="index">
                            <ion-grid>
                                <ion-row>
                                    <ion-col>
                                        <ion-select :value="link.type" @ionChange="changeLinkType(link, $event)">
                                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                                            <ion-select-option value="book">📖Buch</ion-select-option>
                                        </ion-select>
                                    </ion-col>
                                    <ion-col>
                                        <a :href=link.linkUrl>{{ link.linkUrl }}</a>
                                    </ion-col>
                                    <ion-col>
                                        <ion-button @click="deleteLink(link)">
                                            <ion-icon :icon="trashOutline"></ion-icon>
                                        </ion-button>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                    <ion-item>
                        <ion-select :value="linkTyp">
                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                            <ion-select-option value="book">📖Buch</ion-select-option>
                        </ion-select>
                        <ion-input ref="linkInputUrl" placeholder="Url"></ion-input>
                        <ion-button @click="includeLink">
                            <ion-icon :icon="arrowUpOutline"></ion-icon>
                        </ion-button>
                    </ion-item>
                </ion-card-content>
            </ion-card>
            <ion-modal ref="modal" :initial-breakpoint="0.75">
                <ion-header>
                    <ion-toolbar>
                        <ion-button @click="cancel()" slot="start">Zurück</ion-button>
                        <ion-button @click="confirm()" slot="end">Anwenden</ion-button>
                    </ion-toolbar>
                </ion-header>
                <ion-content class="ion-padding">
                    <ion-datetime display-format="YYYY-MM-DDTHH:mm:ssTZD" v-model="SelectedDateTime"></ion-datetime>
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
    IonSearchbar,
    IonImg,
    IonCard,
    useIonRouter,
    IonToast,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonCardContent,
    IonThumbnail,

} from '@ionic/vue';
import { caseService } from '@/services/case-service';
import { calendarOutline, cameraOutline, imageOutline, trashOutline, arrowUpOutline, micOutline, newspaperOutline, bookOutline } from "ionicons/icons";
import { useRoute } from "vue-router";
import { Case, Status, Casetype, ImageData, Link, LinkType } from "@/types/supabase-global";
import HeaderComponent from '../components/Header.vue';
import { currentUserInformation } from "@/services/currentUserInformation-service";

const ionRouter = useIonRouter();
const dataLoaded = ref<boolean>(false);
const pictureLoaded = ref<boolean>(false);
const showComponent = ref<boolean>(false);
const modal = ref();
const isToastOpen = ref(false);
const route = useRoute();
const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const linkInputUrl = ref();
const segment = ref('info');
const linkList = ref<Link[]>([]);

let picture: ImageData[] = [];
let detailCase: Case;
let SelectedDateTime: string;
let CaseType: Casetype;
let CaseStatus: Status;
let CrimeTime: string;
let CrimeDate: string;
let CaseId: string;
let Latitude: number;
let Longitude: number;
let PlaceName: string;
let ToastMessage: string;
let linkTyp: LinkType = "newspaper";
let localUserId: string = "";

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const confirm = () => {
    console.log(SelectedDateTime)
    CrimeDate = convertDateString(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    modal.value.$el.dismiss(null, 'cancel');
}

onMounted(async () => {
    CaseId = route.params['caseId'].toString();
    detailCase = await caseService.getCase(CaseId);
    SelectedDateTime = detailCase[0].crime_date_time;

    localUserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;

    CrimeDate = convertDateString(detailCase[0].crime_date_time);
    CaseType = detailCase[0].case_type;
    CaseStatus = detailCase[0].status;
    Latitude = detailCase[0].lat;
    Longitude = detailCase[0].long;
    PlaceName = detailCase[0].place_name;

    const caseImages = await caseService.getCaseImagesFromStorage(CaseId);
    await Promise.all(caseImages!.map(async (file) => {
        const pictureUri = await caseService.getPublicUrl(file.name, CaseId);
        let imageData: ImageData = {
            pictureUri: pictureUri,
            imageName: file.name
        };
        picture.push(imageData);
    }));

    detailCase.forEach(function (item) {
        let link: Link = {
            linkId: item.link_id,
            type: item.link_type,
            linkUrl: item.url
        };
        linkList.value.push(link);
    });

    pictureLoaded.value = true;

    dataLoaded.value = true;
    showComponent.value = true;
    showComponent.value = false;
    showComponent.value = true;
    setLocation();


});

const setLocation = () => {

    const elem = <HTMLInputElement>document.getElementsByClassName('searchbar-input')[1];
    console.log(elem);
    elem.autocomplete = 'on';

    const autocomplete = new google.maps.places.Autocomplete(elem);
    const returnFields = ["geometry", "name"];
    autocomplete.setFields(returnFields);
    google.maps.event.addListener(autocomplete, 'place_changed', function () {
        const place = autocomplete.getPlace();
        const location = place['geometry']!['location'];
        Latitude = location!.lat();
        Longitude = location!.lng();
        PlaceName = place.name!;
    });
};

const updateCase = async () => {
    const successful = await caseService.updateCase(
        CaseId,
        CaseType,
        localUserId,
        SelectedDateTime,
        Latitude,
        Longitude,
        PlaceName,
        CaseStatus,
        ionInputSummary.value.$el.value,
        ionInputTitle.value.$el.value,
        null,
        linkList.value
    );

    if (successful) {
        ToastMessage = "Case erfolgreich geupdatet!";
        setOpen(true);
    } else {
        ToastMessage = "Etwas lief schief probier es später nochmal!"
        setOpen(true);
    }

};

function convertDateString(inputDate: string): string {
    const date = new Date(inputDate);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    CrimeTime = `${hours}:${minutes}:${seconds}`;
    return `${day}.${month}.${year}`;
}

const deletePicture = async (picture: ImageData) => {
    console.log(picture);
    console.log(CaseId);
    console.log(picture.imageName);
    const successful = await caseService.deleteCaseImageFromStorage(picture.imageName, CaseId);

    if (successful) {
        ToastMessage = "Bild erfolgreich gelöscht";
        setOpen(true);
    } else {
        ToastMessage = "Etwas lief schief probier es später nochmal!"
        setOpen(true);
    }
};

const getPicture = () => {

};

const takePicture = () => {

};

const navigateBack = () => {
    ionRouter.push("/crime-map");
};

const deleteLink = (link: Link) => {
    console.log(link);
    linkList.value = linkList.value.filter(function(item) {
    return item !== link;
    });
};

const includeLink = () => {
    let link: Link = {
        linkId: "",
        type: linkTyp,
        linkUrl: linkInputUrl.value.$el.value
    };
    linkList.value.push(link);
    linkInputUrl.value.$el.value = "";
};

const changeLinkType = (link: Link, type: {detail: {value: LinkType}}) => {
    let linkId = ""

    if(link.linkId !== ""){
        linkId = link.linkId;
    }

    linkList.value = linkList.value.filter(function(item) {
    return item !== link;
    });

    let newLink: Link = {
        linkId: linkId,
        type: type.detail.value,
        linkUrl: link.linkUrl
    };
    linkList.value.push(newLink);

};

const onCalenderClickEvent = () => {
    modal.value.$el.present();
};

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value as Status;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value as Casetype;
};

const getAddress = (place: any) => {
    console.log('Address Object', place);
};

const setOpen = (state: boolean) => {
    isToastOpen.value = state;
};
</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}

ion-button {
    --background: #990000;
}

ion-content{
    --background: transparent:  !important;
}
</style>