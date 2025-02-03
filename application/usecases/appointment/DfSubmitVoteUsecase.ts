import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import { PlaceVoteDto, TimeVoteDto, VoteSubmissionDto } from "./dto/VoteDto";

export class DfSubmitVoteUsecase {
  constructor(
    private timeVoteUserRepo: TimeVoteUserRepository,
    private placeVoteUserRepo: PlaceVoteUserRepository
  ) {}

  async execute(voteData: VoteSubmissionDto): Promise<void> {
    const { userId, appointmentId, timeVotes, placeVotes } = voteData;

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
  }
}
