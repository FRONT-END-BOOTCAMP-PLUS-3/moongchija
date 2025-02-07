import { MemberRepository } from "@/domain/repositories/MemberRepository";

export default class DfEntryMemberUsecases {
  constructor(
    private memberRepository: MemberRepository
  ) {}

  async execute(appointmentId: number, userId: string): Promise<void> {
    try {
      await this.memberRepository.addMemberToAppointment(userId, appointmentId);
    } catch (error) {
      console.log("Error in CreateMemberUseCase:", error);
      throw error;
    }
  }
}
