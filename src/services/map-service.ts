import { supabase } from "./supabase-service";
import {Case, AllCases} from "@/types/supabase-global"

class MapService{
    async getMarkers(): Promise<Case[]>{
        const { data: cases, error } = await supabase
            .from("cases")
            .select('*');
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return [];
        }
        console.log(cases)
        return cases;
    }

    async getAllCases(): Promise<AllCases>{
        const{data: cases, error} = await supabase.rpc("getallcases")
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return [];
        }
        console.log(cases)
        return cases;
    }
}

export const mapService = new MapService();

