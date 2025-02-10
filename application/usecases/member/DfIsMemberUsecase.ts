import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfIsMemberUsecase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(userId: string, appointmentId: number): Promise<boolean> {
    return await this.memberRepository.isUserInAppointment(
      userId,
      appointmentId
    );
  }
}
