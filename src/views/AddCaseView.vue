<template>
    <ion-page>
        <HeaderComponent />

        <ion-content class="ion-padding case">
            <ion-title>
                Fall hinzufügen
            </ion-title>

            <ion-toolbar class="customTransparent">
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
            <!-- Segment one information -->
            <ion-card v-show="segment === 'info'" class="customTransparent">

                <!-- title -->
                <ion-item class="customTransparent">
                    <ion-input ref="ionInputTitle" label="Titel" label-placement="floating"
                        :auto-grow="true"></ion-input>
                </ion-item>

                <!-- summary -->
                <ion-item class="customTransparent">
                    <ion-textarea ref="ionInputSummary"  label="Zusammenfassung" label-placement="floating"
                        :auto-grow="true"></ion-textarea>
                </ion-item>

                <!-- Location -->
                <ion-item class="customTransparent">
                    <ion-searchbar class="customTransparentAndShadowNoneSeearchbar" autocomplete="on"
                        @ion-focus="setLocation" show-clear-button="always" :clear-icon="trashOutline"
                        placeholder="Tatort" :value="PlaceName"></ion-searchbar>

                </ion-item>

                <!-- state -->
                <ion-item class="customTransparent">
                    <ion-select aria-label="Fallstatus" label="Fallstatus" label-placement="floating"
                        :value="CaseStatus" @ionChange="handleStatusChange">
                        <ion-select-option value="closed">Gelöst</ion-select-option>
                        <ion-select-option value="open">Ungelöst</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- type -->
                <ion-item class="customTransparent">
                    <ion-select label="Straftat" label-placement="floating" aria-label="Straftat"
                        :value="CaseType" @ionChange="handleCaseTypeChange">
                        <ion-select-option value="murder">Mord</ion-select-option>
                        <ion-select-option value="theft">Diebstahl</ion-select-option>
                        <ion-select-option value="robbery-murder">Raub mit Mord</ion-select-option>
                        <ion-select-option value="brawl">Schlägerei</ion-select-option>
                        <ion-select-option value="rape">Vergewaltigung</ion-select-option>
                    </ion-select>
                </ion-item>

                <!-- case date -->
                <ion-item class="customTransparent">
                    <ion-grid>
                        <ion-row>
                            <ion-col size="3" class="my-auto mx-2">
                                <ion-fab-button @click="onCalenderClickEvent" color="secondary">
                                    <ion-icon :icon="calendarOutline"></ion-icon>
                                </ion-fab-button>
                            </ion-col>
                            <ion-col>
                                <ion-input ref="ionInputCrimeDate" :readonly="true" label="Tatdatum: "
                                    :value="CrimeDate"></ion-input>
                                <ion-input ref="ionInputCrimeTime" :readonly="true" label="Tatzeit: "
                                    :value="CrimeTime"></ion-input>
                            </ion-col>
                        </ion-row>
                        <ion-row>
                        <ion-col size="3">
                            <ion-button @click="createCase">Erstellen</ion-button>
                        </ion-col>
                        <ion-col size="5">
                        </ion-col>
                        <ion-col size="4">
                            <ion-button @click="navigateBack">Zurück</ion-button>
                        </ion-col>
                    </ion-row>
                    </ion-grid>
                </ion-item>
            </ion-card>


            <!-- segment two pictures -->
            <ion-card v-show="segment === 'picture'" class="customTransparent">
                <ion-card-content>

                    <ion-item v-for="(pic, index) of picture" :key="index" class="customTransparent">
                        <ion-grid>
                            <ion-row>
                                <ion-col size="3">
                                    <ion-thumbnail slot="start">
                                        <ion-img alt="Hier sollte ein Bild sein" :src=pic.pictureUri />
                                    </ion-thumbnail>
                                </ion-col>
                                <ion-col>
                                    <ion-label>{{ pic.imageName }}</ion-label>
                                </ion-col>
                                <ion-col>
                                    <ion-button @click="deletePicture(pic)">
                                        <ion-icon :icon="trashOutline"></ion-icon>
                                    </ion-button>
                                </ion-col>
                            </ion-row>
                        </ion-grid>
                    </ion-item>

                    <div class="flex justify-center customTransparent">
                        <ion-button @click="takePicture">
                            <ion-icon :icon="cameraOutline"></ion-icon>
                        </ion-button>
                        <ion-button @click="getPicture">
                            <ion-icon :icon="imageOutline"></ion-icon>
                        </ion-button>
                    </div>
                </ion-card-content>

            </ion-card>



            <!-- segment three links -->
            <ion-card v-show="segment === 'links'" class="customTransparent">
                <ion-card-content class="customTransparent">
                    Updaten über den Update Button auf der Info Seite!
                    <ion-list class="customTransparent">
                        <ion-item v-for="(link, index) in linkList" :key="index" class="customTransparent">
                            <ion-grid class="customTransparent">
                                <ion-row class="customTransparent">
                                    <ion-col class="customTransparent">
                                        <ion-select :value="link.type" @ionChange="changeLinkType(link, $event)" class="customTransparent">
                                            <ion-select-option value="newspaper">📰Zeitung</ion-select-option>
                                            <ion-select-option value="podcast">🎧Podcast</ion-select-option>
                                            <ion-select-option value="book">📖Buch</ion-select-option>
                                        </ion-select>
                                    </ion-col>
                                    <ion-col class="customTransparent">
                                        <a :href=link.linkUrl>{{ link.linkUrl }}</a>
                                    </ion-col>
                                    <ion-col class="customTransparent">
                                        <ion-button @click="deleteLink(link)">
                                            <ion-icon :icon="trashOutline"></ion-icon>
                                        </ion-button>
                                    </ion-col>
                                </ion-row>
                            </ion-grid>
                        </ion-item>
                    </ion-list>
                    <ion-item class="customTransparent">
                        <ion-select :value="linkTyp" class="customTransparent">
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




            <!-- modal calender -->
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


            <!-- toast as information -->
            <ion-toast trigger="open-toast" :is-open="isToastOpen" :message=ToastMessage :duration="5000"
                @didDismiss="setOpen(false)"></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
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
import { ref, onMounted } from "vue";
import HeaderComponent from '../components/Header.vue';
import { Case, Status, Casetype, ImageData, Link, LinkType } from "@/types/supabase-global";
import { calendarOutline, cameraOutline, imageOutline, trashOutline, arrowUpOutline} from "ionicons/icons";
import { caseService } from '@/services/case-service';
import { currentUserInformation } from "@/services/currentUserInformation-service";

const ionRouter = useIonRouter();
const modal = ref();
const isToastOpen = ref(false);

const ionInputTitle = ref();
const ionInputSummary = ref();
const ionInputCrimeDate = ref();
const ionInputCrimeTime = ref();
const linkInputUrl = ref();
const segment = ref('info');

let picture: ImageData[] = [];
const linkList = ref<Link[]>([]);
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

onMounted(async() => {
    localUserId = (await currentUserInformation.getCurrentUser()).data.session!.user.id;
})

const cancel = () => {
    modal.value.$el.dismiss(null, 'cancel');
}

const onCalenderClickEvent = () => {
    modal.value.$el.present();
};

const confirm = () => {
    console.log(SelectedDateTime)
    CrimeDate = convertDateString(SelectedDateTime);
    ionInputCrimeDate.value.$el.value = CrimeDate;
    ionInputCrimeTime.value.$el.value = CrimeTime;
    modal.value.$el.dismiss(null, 'cancel');
}
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

    linkList.value = linkList.value.filter(function(item) {
    return item !== link;
    });

    let newLink: Link = {
        linkId: "",
        type: type.detail.value,
        linkUrl: link.linkUrl
    };
    linkList.value.push(newLink);
};

const deletePicture = async (picture: ImageData) => {
};

const getPicture = () => {

};

const takePicture = () => {

};

const handleStatusChange = async (event: { detail: { value: string } }) => {
    CaseStatus = event.detail.value as Status;
};

const handleCaseTypeChange = async (event: { detail: { value: string } }) => {
    CaseType = event.detail.value as Casetype;
};

const createCase = async () => {
    const successful = await caseService.createCase(
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
        ToastMessage = "Case erfolgreich erstellt!";
        setOpen(true);
    } else {
        ToastMessage = "Etwas lief schief probier es später nochmal!"
        setOpen(true);
    }

};

const navigateBack = () => {
    ionRouter.push("/crime-map");
};

const setOpen = (state: boolean) => {
    isToastOpen.value = state;
};

const getAddress = (place: any) => {
    console.log('Address Object', place);
};
</script>

<style scoped>
.input-row {
    margin-bottom: 20px;
}

ion-button {
    --background: #990000;
}

.select-fill-solid {
    --background: white;
}

ion-content {
    --background: transparent: !important;
}


ion-searchbar.customTransparentAndShadowNoneSeearchbar {
    --background: #19422d00;
    --color: #000000;
    --placeholder-color: #000000;
    --icon-color: #000000;
    --clear-button-color: #000000;
    --box-shadow: none;
    --border-radius: 4px;
}


ion-searchbar.ios.custom {
    --cancel-button-color: #000000;
}

ion-searchbar.md.custom {
    --cancel-button-color: #000000;
}
</style>