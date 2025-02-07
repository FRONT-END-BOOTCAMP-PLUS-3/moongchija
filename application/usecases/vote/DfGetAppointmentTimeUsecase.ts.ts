import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { Appointment } from "@/domain/entities/Appointment";

export class DfGetAppointmentTimeUsecase {
  constructor(private repository: AppointmentRepository) {}

  async execute(appointmentId: number): Promise<Partial<Appointment> | null> {
    return await this.repository.getAppointmentTime(appointmentId);
  }
}
