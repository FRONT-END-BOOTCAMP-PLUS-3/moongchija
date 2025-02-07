import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { ImageListDto } from "./dto/ImageListDto";

export class DfGetAllImagesUsecase {
  constructor(private imageRepo: AppointmentImageRepository) {}

  async execute(): Promise<ImageListDto[]> {
    const images = await this.imageRepo.getAllImages();

    return images.map((image) => ({
      id: image.id,
      appointment_id: image.appointment_id,
      image_url: image.image_url,
      creater_id: image.creater_id,
      created_at: new Date(image.created_at),
    }));
  }
}
