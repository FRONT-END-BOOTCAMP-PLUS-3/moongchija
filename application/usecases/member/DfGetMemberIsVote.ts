import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfGetMemberIsVote {
  private memberRepository: MemberRepository;

  constructor(memberRepository: MemberRepository) {
    this.memberRepository = memberRepository;
  }

  async execute(appointmentId: number, userId: string): Promise<string> {
    // 사용자 투표 상태 확인
    const isVoted = await this.memberRepository.findIsVoteByAppointmentIdAndUserId(appointmentId, userId);

    if (isVoted) {
      return `appointments/${appointmentId}/vote-result`;  // 투표 완료된 경우 'result' 페이지로 이동
    } else {
      return `appointments/${appointmentId}/vote-time`;    // 투표하지 않은 경우 'vote-time' 페이지로 이동
    }
  }
}