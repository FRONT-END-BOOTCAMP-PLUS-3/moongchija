import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import { PlaceVoteDto, TimeVoteDto, VoteSubmissionDto } from "./dto/VoteDto";
import { MemberRepository } from "@/domain/repositories/MemberRepository";

export class DfSubmitVoteUsecase {
  constructor(
    private timeVoteUserRepo: TimeVoteUserRepository,
    private placeVoteUserRepo: PlaceVoteUserRepository,
    private memberRepo: MemberRepository
  ) {}

  async execute(voteData: VoteSubmissionDto): Promise<void> {
    const { userId, appointmentId, timeVotes, placeVotes } = voteData;

    // ✅ 1. 투표하려는 사용자의 is_vote 확인
    const member = await this.memberRepo.getMemberStatus(userId, appointmentId);
    if (!member) {
      throw new Error("해당 약속의 멤버가 아닙니다.");
    }

    if (member.is_vote) {
      throw new Error("❌ 이미 투표한 사용자입니다.");
    }

    // ✅ 1. 사용자가 시간 투표한 데이터 저장 (time_vote_user 테이블)
    await Promise.all(
      timeVotes.map(async (timeVote: TimeVoteDto) => {
        await this.timeVoteUserRepo.voteForTime(userId, timeVote.timeId);
      })
    );

    // ✅ 2. 사용자가 장소 투표한 데이터 저장 (place_vote_user 테이블)
    await Promise.all(
      placeVotes.map(async (placeVote: PlaceVoteDto) => {
        await this.placeVoteUserRepo.voteForPlace(userId, placeVote.placeId);
      })
    );

    // ✅ 4. 투표 완료 후 사용자의 `is_vote` 상태를 `true`로 업데이트
    await this.memberRepo.updateVoteStatus(userId, appointmentId, true);

    console.log("📌 [DEBUG] DfSubmitVoteUsecase 완료!");
  }
}
