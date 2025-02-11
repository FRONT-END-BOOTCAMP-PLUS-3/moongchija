import { AppointmentImageRepository } from "@/domain/repositories/AppointmentImageRepository";
import { ImageUploadDto } from "./dto/ImageUploadDto";

export class DfCreateImageUsecase {
  constructor(private repository: AppointmentImageRepository) {}

  async execute(dto: ImageUploadDto) {
    if (!dto.file) {
      throw new Error("파일이 없습니다.");
    }

    // ✅ 통합된 리포지토리 함수 사용
    const savedImage = await this.repository.createImage(
      dto.file,
      dto.appointment_id,
      dto.creater_id
    );

    return savedImage;
  }
}