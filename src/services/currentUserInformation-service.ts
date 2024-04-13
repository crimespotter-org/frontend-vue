import { supabase } from "./supabase-service";
import { Role } from "@/types/supabase-global";

class CurrentUserInformation {
  async getCurrentUserRole(): Promise<Role> {
    let localUser = this.getCurrentUser();
    //console.log("User: " + (await localUser).data.session?.user.email);
    let localUserID = (await localUser).data.session?.user.id;

    const { data: user_profile, error } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", localUserID);

    if (error) {
      console.error("Fehler beim Abrufen der Daten:", error.message);
      //If no role was found, default is crimespotter
      return "crimespotter";
    }

    return user_profile[0].role;
  }

  async getCurrentUser() {
    let LocalUser = await supabase.auth.getSession();
    return LocalUser;
  }
}

export const currentUserInformation = new CurrentUserInformation();
