<template>
  <ion-page>
    <HeaderComponent />
    <ion-content class="ion-padding case">
      <ion-title size="large">Benutzerrollen ändern</ion-title>
      <ion-item class="customTransparent">

        <ion-select v-model="selectedUser" aria-label="Benutzer auswählen" label="Benutzer auswählen"
          interface="action-sheet">
          <ion-select-option v-for="user in allUsers" :key="user.id">{{ user.username
            }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-item class="customTransparent">
        <ion-select v-model="selectedRole" aria-label="Neue Rolle auswählen" label="Neue Rolle auswählen"
          interface="action-sheet">
          <ion-select-option v-for="role in allRoles" :key="role" :value="role">{{ role }}</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-button @click="changeUserRole()" class="m-4">Rolle ändern</ion-button>
      <ion-toast :is-open="changeSuccesful" @didDismiss="setOpenChangeSuccessful(false)"
        message="Benutzerrolle geändert." :duration="5000"></ion-toast>
      <ion-toast :is-open="changedOwnRole" @didDismiss="setOpenOwnRole(false)"
        message="Sie können Ihre eigene Benutzerrolle nicht ändern. Bitte wählen Sie einen anderen Benutzer aus."
        :duration="5000"></ion-toast>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonButton, IonText, IonToast } from '@ionic/vue';
import { defineComponent } from 'vue';
import HeaderComponent from '../components/Header.vue';
import { supabase } from "@/services/supabase-service";
import { ref } from 'vue';
import { Role } from "@/types/supabase-global";
import { currentUserInformation } from '@/services/currentUserInformation-service';



let role_crimespotter: Role;
let role_crimefluencer: Role;
let role_admin: Role;
let selectedUser = ref(null);
let selectedRole = ref(null);
let allRoles = ref([]);
let allUsers = ref([]);
let changeSuccesful = ref(false);
let changedOwnRole = ref(false);

getUsers();

async function getUsers() {
  role_crimespotter = 'crimespotter';
  role_crimefluencer = 'crimefluencer';
  role_admin = 'admin';

  allRoles = [role_admin, role_crimefluencer, role_crimespotter];
  console.log(allRoles);

  let { data: user_list, error } = await supabase
    .from('user_profiles')
    .select('*');

  if (!error) {

    allUsers.value = user_list;
    console.log(allUsers.value[0].username);
    console.log("Users: " + allUsers.value);
    //return (data);
  }
}


async function changeUserRole() {
  console.log("Rolle" + selectedRole.value)
  console.log("USer" + selectedUser.value)

  let localUser = await currentUserInformation.getCurrentUser();
  let localUserMail = localUser.data.session?.user.email;

  if (selectedUser.value != localUserMail) {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: selectedRole.value })
      .eq('username', selectedUser.value)
      .select()

    if (!error) {
      setOpenChangeSuccessful(true);
      selectedRole.value = null;
      selectedUser.value = null;
    } else {
      console.log("Error" + error)
    }
  } else {
    setOpenOwnRole(true);
    selectedRole.value = null;
    selectedUser.value = null;
  }


}

const setOpenOwnRole = (state: boolean) => {
  changedOwnRole.value = state;
};

const setOpenChangeSuccessful = (state: boolean) => {
  changeSuccesful.value = state;
};


</script>
