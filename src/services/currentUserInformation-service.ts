import { supabase } from "./supabase-service";
import { Role } from "@/types/supabase-global";

class CurrentUserInformation {
  async getCurrentUserRole(): Promise<Role> {
    const localUser = this.getCurrentUser();
    const localUserID = (await localUser).data.session?.user.id;

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
    const LocalUser = await supabase.auth.getSession();
    return LocalUser;
  }

  async getUserName(userId: string) {
    const { data: user } = await supabase
      .from("user_profiles")
      .select("username")
      .eq("id", userId)
      .single();

    return user ? user.username : "";
  }
}

export const currentUserInformation = new CurrentUserInformation();
