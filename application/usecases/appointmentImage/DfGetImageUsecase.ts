import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { ImageListDto } from "./dto/ImageListDto";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class DfGetImageUsecase {
  constructor(private imageRepo: AppointmentImageRepository, 
    private userRepo: UserRepository
  ) {}

  async execute(appointmentId: number): Promise<ImageListDto[]> {
    const images = await this.imageRepo.getImagesByAppointmentId(appointmentId);
    const userIds = images.map((img)=>img.creater_id) // ["asdf123", "dfgh456", "hjkl789"]
    const nicknames = await this.userRepo.getNicknamesByUserIds(userIds)// [{ "asdf123", "가나다" }, {"dfgh456", "라마바"}, {"hjkl789", "사아자"}]

    return images.map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id, // ex) ["asdf123", "dfgh456", "hjkl789"]
      created_at: image.created_at,
      nickname: 
        nicknames // [{ "asdf123", "가나다" }, {"dfgh456", "라마바"}, {"hjkl789", "사아자"}]
      .filter(nickname => nickname.user_id === image.creater_id)
      .map(nickname => nickname.nickname)[0]
  }));
  }
}
