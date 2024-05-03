import { Camera, CameraResultType } from "@capacitor/camera";
import { currentUserInformation } from "./currentUserInformation-service";
import { supabase } from "./supabase-service";

class CameraService {

  async takePhoto(): Promise<File>{
    const getPhoto = await Camera.getPhoto({
      quality: 75,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    const blob = await fetch(getPhoto.webPath!).then(async (r) => {
      return new Blob([await r.arrayBuffer()], { type: `image/${getPhoto.format}` });
    });
    const file = new File([blob], (await currentUserInformation.getCurrentUser()).data.session!.user.id, {
      type: blob.type,
    });
    console.log(file);

    return file;
  }

  async uploadPhoto(image: File, caseId: string): Promise<boolean>{
    const { data, error } = await supabase.storage
      .from("media")
      .upload(`case-${caseId}/${image.name}`, image)
      if(error){
        console.error(error);
        return false;
      }
      return true;
  }
}

export const cameraService = new CameraService();
