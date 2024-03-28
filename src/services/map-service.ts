import { supabase } from "./supabase-service";
import {Case, AllCases, Coordinate} from "@/types/supabase-global"
import { Geolocation } from "@capacitor/geolocation";

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
        const{data: cases, error} = await supabase.rpc("get_all_cases")
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return [];
        }
        console.log(cases)
        return cases;
    }

    async currentLocation() : Promise<Coordinate>{
        const currentLocation = await Geolocation.getCurrentPosition();
        const coordinate = {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude};
        return coordinate;
    }
}

export const mapService = new MapService();

