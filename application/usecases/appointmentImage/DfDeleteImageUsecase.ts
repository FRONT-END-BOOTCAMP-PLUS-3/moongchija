import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";

export class DfDeleteImageUsecase {
  constructor(private imageRepo: AppointmentImageRepository) {}

  async execute(imageId: string): Promise<boolean> {
    if (!imageId) {
      throw new Error("유효한 이미지 ID가 필요합니다.");
    }

    return await this.imageRepo.deleteImage(imageId);
  }
}
