import { supabase } from "./supabase-service";
import {Case, AllCases} from "@/types/supabase-global"

class AddCase{
    async getMarkers(formData): Promise<Case[]>{
                 const { data: cases, error } = await supabase
                .from('cases')
                .insert([{ ...formData.value }])
        if (error) {
            console.error('Fehler beim Abrufen der Daten:', error.message);
            return [];
        }
        console.log(cases)      
    }
}

export const addCase = new AddCase();

