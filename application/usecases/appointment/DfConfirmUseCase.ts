import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";

export class DfConfirmAppointmentUseCase {
  constructor(private appointmentRepo: AppointmentRepository) {}

  async execute(
    appointmentId: number,
    confirmData: {
      confirm_time: string;
      confirm_place: string;
      confirm_place_url: string;
    }
  ) {
    // ✅ 선택된 약속 정보를 appointment 테이블에 업데이트
    await this.appointmentRepo.confirmAppointment(appointmentId, {
      confirm_time: confirmData.confirm_time,
      confirm_place: confirmData.confirm_place,
      confirm_place_url: confirmData.confirm_place_url,
      status: "confirmed", // 약속 상태 변경
    });
  }
}
