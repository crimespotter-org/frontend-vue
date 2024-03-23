import { supabase } from "./supabase-service";
import {Ref, ref } from "vue";
import {Case} from "@/types/supabase-global"

class MapService{
    public cases:  Ref<Case> = ref({} as Case)

    async getMarkers(){
        const { data, error } = await supabase
            .from("cases")
            .select('*')
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return;
        }
        this.cases = data[0];
    }
}

export const mapService = new MapService();

