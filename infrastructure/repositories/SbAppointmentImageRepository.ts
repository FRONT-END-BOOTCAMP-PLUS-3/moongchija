import { AppointmentImage } from "@/domain/entities/AppointmentImage";
import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SbAppointmentImageRepository
  implements AppointmentImageRepository
{
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }

  // 전체 이미지 조회
  async getAllImages(): Promise<AppointmentImage[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment_image")
      .select("id, appointment_id, image_url, creater_id, created_at");

    if (error) {
      throw new Error("이미지 목록 조회 실패");
    }

    return (data || []).map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id,
      created_at: new Date(image.created_at),
    }));
  }

  // 특정 약속의 이미지 조회
  async getImagesByAppointmentId(
    appointmentId: number
  ): Promise<AppointmentImage[]> {
    const supabase = await this.getClient();
    const { data, error } = await supabase
      .from("appointment_image")
      .select("id, appointment_id, image_url, creater_id, created_at")
      .eq("appointment_id", appointmentId);

    if (error) {
      throw new Error("특정 약속 이미지 조회 실패: " + error.message);
    }

    return (data || []).map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id,
      created_at: new Date(image.created_at),
    }));
  }

  // 이미지 생성
  // async createImage(newImage: Omit<AppointmentImage, 'id' | 'created_at'>): Promise<AppointmentImage> {
  //   const supabase = await this.getClient();
  //   const { data, error } = await supabase
  //     .from("appointment_image")
  //     .insert(newImage)
  //     .select();

  //   if (error || !data || data.length === 0) {
  //     throw new Error("이미지 생성 실패: " + (error?.message || "알 수 없는 오류"));
  //   }

  //   const createdImage = data[0];
  //   return {
  //     id: createdImage.id,
  //     appointment_id: createdImage.appointment_id,
  //     image_url: createdImage.image_url,
  //     creater_id: createdImage.creater_id,
  //     created_at: new Date(createdImage.created_at),
  //   };
  // }

  async createImage(
    file: File,
    appointment_id: number,
    creater_id: string
  ): Promise<void> {
    const supabase = await this.getClient();

    // 1️⃣ ✅ Supabase 스토리지에 파일 업로드
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `appointment_images/${fileName}`;

    const { error: storageError } = await supabase.storage
      .from("images") // ✅ 스토리지 버킷 이름
      .upload(filePath, file);

    if (storageError) {
      throw new Error("스토리지 업로드 실패: " + storageError.message);
    }

    const uploadedImageUrl = `https://yswjnlalguzoxdcmydxr.supabase.co/storage/v1/object/public/images/${filePath}`;

    // 2️⃣ ✅ 업로드된 이미지 URL을 DB에 저장
    const { data: dbData, error: dbError } = await supabase
      .from("appointment_image")
      .insert([
        {
          appointment_id,
          image_url: uploadedImageUrl,
          creater_id,
        },
      ])
      .select()
      .single();

    if (dbError) {
      throw new Error("DB 저장 실패: " + dbError.message);
    }

    return dbData;
  }

  // 이미지 삭제
  async deleteImage(imageId: number): Promise<boolean> {
    const supabase = await this.getClient();

    const { data: imageData, error: fetchError } = await supabase
      .from("appointment_image")
      .select("image_url")
      .eq("id", imageId)
      .single();

    if (fetchError || !imageData) {
      console.error("❌ 이미지 정보를 찾을 수 없음:", fetchError?.message);
      return false;
    }

    const imageUrl = imageData.image_url;
    const filePath = imageUrl.replace(
      "https://yswjnlalguzoxdcmydxr.supabase.co/storage/v1/object/public/images/",
      ""
    );

    const { error: storageError } = await supabase.storage
      .from("images")
      .remove([filePath]);

    if (storageError) {
      console.error("❌ 스토리지에서 이미지 삭제 실패:", storageError.message);
      return false;
    } else {
      const { error: deleteError } = await supabase
        .from("appointment_image")
        .delete()
        .eq("id", imageId);

      if (deleteError) {
        console.error("❌ DB에서 이미지 삭제 실패:", deleteError.message);
        return false;
      }
    }
    return true;
  }
}
