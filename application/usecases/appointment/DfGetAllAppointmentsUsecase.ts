import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { AppointmentListDto } from "./dto/AppointmentListDto";

export class DfGetAllAppointmentsUsecase {
  constructor(private appointmentRepo: AppointmentRepository) {}

  async execute(): Promise<AppointmentListDto[]> {
    const appointments = await this.appointmentRepo.getAllAppointments();

    // ✅ UseCase에서 DTO 변환
    return appointments.map((appointment) => ({
      id: appointment.id,
      title: appointment.title,
      status: appointment.status,
      confirm_time: appointment.confirm_time,
      created_at: appointment.created_at,
    }));
  }
}
