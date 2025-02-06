import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfGetMemberIsVote {
  private memberRepository: MemberRepository;

  constructor(memberRepository: MemberRepository) {
    this.memberRepository = memberRepository;
  }

  async execute(appointmentId: number, userId: string): Promise<boolean> {
    // 사용자 투표 상태 확인
    const isVoted = await this.memberRepository.findIsVoteByAppointmentIdAndUserId(appointmentId, userId);

    return isVoted;
  }
}