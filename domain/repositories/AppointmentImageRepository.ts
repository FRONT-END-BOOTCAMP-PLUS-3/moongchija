import { AppointmentImage } from "../entities/AppointmentImage";

export interface AppointmentImageRepository {
  // 전체 이미지 조회
  getAllImages(): Promise<AppointmentImage[]>;

  // 특정 약속의 이미지 조회
  getImagesByAppointmentId(appointmentId: number): Promise<AppointmentImage[]>;

 // 이미지 생성
  createImage(file: File, appointment_id: number, creater_id: string): Promise<void>;


  // 이미지 삭제
  deleteImage(imageId: string): Promise<boolean>;
}
