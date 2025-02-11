import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import {
  PlaceVoteDto,
  TimeVoteDto,
  TimeVoteInputDto,
  VoteSubmissionDto,
} from "./dto/VoteDto";
import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { TimeVoteRepository } from "@/domain/repositories/TimeVoteRepository";

export class DfSubmitVoteUsecase {
  constructor(
    private timeVoteUserRepo: TimeVoteUserRepository,
    private placeVoteUserRepo: PlaceVoteUserRepository,
    private memberRepo: MemberRepository,
    private timeVoteRepo: TimeVoteRepository
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

    // ✅ 2. page에서 받은 time(YYYY-MM-DD HH:MM:SS)이 time_vote테이블에 존재하면 time_id반환 없으면 null반환
    const timeVoteInputs: TimeVoteInputDto[] =
      timeVotes as unknown as TimeVoteInputDto[];

    const existingTimeVotes: (TimeVoteDto | null)[] = await Promise.all(
      timeVoteInputs.map(async (vote) => {
        const existingTimeId = await this.timeVoteRepo.findTimeIdByTimestamp(
          appointmentId,
          vote.time // ✅ `{ time: string }`이므로 `vote.time`만 전달
        );
        return existingTimeId ? { timeId: existingTimeId } : null;
      })
    );

    // ✅ 3. page에서 받은 time들 가운데 time_id가 없는 것듯은 nuwTimes에 저장
    const newTimes: string[] = timeVoteInputs
      .filter((_, index) => !existingTimeVotes[index]) // ✅ `null`이 아닌 경우만 필터링
      .map((vote) => vote.time); // ✅ 이제 `vote.time`은 반드시 `string`

    // ✅ 4. 새로운 시간들을 DB에 추가하고 ID 리스트 가져오기
    const newTimeIds = await this.timeVoteRepo.createTimeVotes(
      appointmentId,
      newTimes
    );

    // ✅ 5. null 값을 newTimeIds에서 가져올 때 올바르게 매핑
    let newTimeIndex = 0;
    const processedTimeVotes: TimeVoteDto[] = existingTimeVotes.map((vote) => {
      if (vote) return vote; // ✅ 기존 `timeId` 유지
      const newTimeId = newTimeIds[newTimeIndex++];
      if (!newTimeId) throw new Error("새로운 timeId 매핑 중 오류 발생"); // ✅ 예외 처리 추가
      return { timeId: newTimeId };
    });

    // ✅ 6. 사용자가 시간 투표한 데이터 저장 (time_vote_user 테이블)
    await Promise.all(
      processedTimeVotes.map(async (timeVote: TimeVoteDto) => {
        await this.timeVoteUserRepo.voteForTime(userId, timeVote.timeId);
      })
    );

    // ✅ 7. 사용자가 장소 투표한 데이터 저장 (place_vote_user 테이블)
    await Promise.all(
      placeVotes.map(async (placeVote: PlaceVoteDto) => {
        await this.placeVoteUserRepo.voteForPlace(userId, placeVote.placeId);
      })
    );

    // ✅ 8. 투표 완료 후 사용자의 `is_vote` 상태를 `true`로 업데이트
    await this.memberRepo.updateVoteStatus(userId, appointmentId, true);
  }
}
