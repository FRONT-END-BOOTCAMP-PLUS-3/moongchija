import { Appointment } from "@/domain/entities/Appointment";
import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";

export class DfGetAppointmentUsecase {
  constructor(
    private appointmentRepository: AppointmentRepository,
  ) {}

  async execute(appointmentId: number): Promise<Appointment> {
    try {
      const appointment = await this.appointmentRepository.findById(appointmentId);
      if (!appointment) {
        throw new Error(`Appointment with id ${appointmentId} not found`);
      }
      return appointment;
    } catch (error) {
      console.log("Error get appointment:", error);
      throw error;
    }
  }
}
