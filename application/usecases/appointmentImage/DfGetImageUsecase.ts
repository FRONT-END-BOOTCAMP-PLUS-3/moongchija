import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { ImageListDto } from "./dto/ImageListDto";

export class DfGetImageUsecase {
  constructor(private imageRepo: AppointmentImageRepository) {}

  async execute(appointmentId: number): Promise<ImageListDto[]> {
    const images = await this.imageRepo.getImagesByAppointmentId(appointmentId);

    return images;
  }
}
