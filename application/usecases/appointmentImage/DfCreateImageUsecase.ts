import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { AppointmentImage } from "@/domain/entities/AppointmentImage";
import { ImageListDto } from "./dto/ImageListDto";

export class DfCreateImageUsecase {
  constructor(private imageRepo: AppointmentImageRepository) {}

  async execute(dto: ImageListDto): Promise<AppointmentImage> {
    const createdImage = await this.imageRepo.createImage({
      appointment_id: dto.appointment_id,
      image_url: dto.image_url,
      creater_id: dto.creater_id,
    });
    return createdImage;
  }
}
