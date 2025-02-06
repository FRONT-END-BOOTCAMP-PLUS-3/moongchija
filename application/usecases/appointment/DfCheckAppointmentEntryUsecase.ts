import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfCheckAppointmentEntryUsecase {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private memberRepository: MemberRepository
  ) {}

  async execute(appointmentId: number, userId: string) : Promise<boolean> {
    const appointment = await this.appointmentRepository.findById(
      appointmentId
    );

    if (!appointment) {
      throw new Error("해당 약속 방을 찾을 수 없습니다. 방 번호를 확인해주세요.");
    }

    return this.memberRepository.isUserInAppointment(userId, appointment.id!);
  }
}
