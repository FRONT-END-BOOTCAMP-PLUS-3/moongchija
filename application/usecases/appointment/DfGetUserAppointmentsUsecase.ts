import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export class DfGetUserAppointmentsUsecase {
  constructor(
    private userRepository: SbUserRepository,
    private appointmentRepository: SbAppointmentRepository,
    private memberRepository: SbMemberRepository
  ) {}

  async execute(userId: string) {
    const members = await this.memberRepository.findByUserId(userId);

    const appointmentIds = members.map((m) => m.appointment_id);

    if (appointmentIds.length === 0) return [];

    const appointments =
      (await this.appointmentRepository.findByIds(appointmentIds)) ?? [];
    console.log(appointments);

    return appointments.map((appointment) => {
      return {
        id: appointment.id,
        title: appointment.title,
        status: appointment.status,
        start: appointment.start_time,
        end: appointment.end_time,
        confirmed_time: appointment.confirm_time,
      };
    });
  }
}
