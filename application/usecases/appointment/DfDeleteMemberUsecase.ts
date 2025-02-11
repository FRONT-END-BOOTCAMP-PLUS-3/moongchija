import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfDeleteMemberUsecase {
  constructor(private memberRepository: MemberRepository) {}

  async execute(userId: string, appointmentId: number): Promise<void> {
    if (!userId || !appointmentId || isNaN(appointmentId)) {
      throw new Error("유효한 사용자 ID와 약속 ID가 필요합니다.");
    }

    console.log('userId', userId )
    console.log('appontmentId',appointmentId )

    try {
      await this.memberRepository.deleteMember(userId, appointmentId);
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
      throw new Error("멤버 삭제에 실패했습니다.");
    }
  }
}