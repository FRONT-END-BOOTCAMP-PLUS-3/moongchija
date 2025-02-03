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

    // ✅ 이미 멤버인지 확인
    const isMember = await this.memberRepo.isUserInAppointment(
      userId,
      appointmentId
    );
    if (isMember) {
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

    // ✅ 3. 투표 완료 후 사용자를 appointment 멤버로 추가
    console.log(
      `📌 [DEBUG] ${userId}를 appointment ${appointmentId}의 멤버로 추가`
    );
    await this.memberRepo.addMemberToAppointment(userId, appointmentId);

    console.log("📌 [DEBUG] DfSubmitVoteUsecase 완료!");
  }
}
