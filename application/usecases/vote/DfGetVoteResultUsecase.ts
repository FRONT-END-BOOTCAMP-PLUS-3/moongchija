import { MemberRepository } from "@/domain/repositories/MemberRepository";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { TimeVoteRepository } from "@/domain/repositories/TimeVoteRepository";
import { PlaceVoteRepository } from "@/domain/repositories/PlaceVoteRepository";

export class DfGetVoteResultUseCase {
  constructor(
    private memberRepo: MemberRepository,
    private userRepo: UserRepository,
    private timeVoteUserRepo: TimeVoteUserRepository,
    private placeVoteUserRepo: PlaceVoteUserRepository,
    private appointmentRepo: AppointmentRepository,
    private timeVoteRepo: TimeVoteRepository,
    private placeVoteRepo: PlaceVoteRepository
  ) {}

  async execute(appointmentId: number) {
    // ✅ 1. 해당 약속에서 투표 완료한 유저들의 user_id 조회
    const votedUserIds = await this.memberRepo.getVotedMemberIdsByAppointment(
      appointmentId
    );

    // ✅ 2. user_id 리스트를 이용해 닉네임 조회
    const votedUsers = await this.userRepo.getNicknamesByUserIds(votedUserIds);

    // ✅ 3. 시간 투표 결과 조회
    const timeVotes = await this.timeVoteRepo.getTimeVotesByAppointment(
      appointmentId
    );
    const timeResults = await Promise.all(
      timeVotes.map(async (timeVote) => {
        const users = await this.timeVoteUserRepo.getUsersByTime(timeVote.id);
        return {
          date: timeVote.time,
          user: users.map((user) => user.nickname), // ✅ nickname 반환
        };
      })
    );

    // ✅ 4. 장소 투표 결과 조회
    const placeVotes = await this.placeVoteRepo.getPlacesByAppointment(
      appointmentId
    );
    const placeResults = await Promise.all(
      placeVotes.map(async (placeVote) => {
        const users = await this.placeVoteUserRepo.getUsersByPlace(
          placeVote.id as number
        );
        return {
          place: placeVote.place,
          place_url: placeVote.place_url,
          user: users.map((user) => user.nickname), // ✅ nickname 반환
        };
      })
    );

    // ✅ 5. 약속 정보 조회 (owner_id, start_time, end_time 포함)
    const appointmentInfo = await this.appointmentRepo.findById(appointmentId);

    // ✅ 6. 최종 데이터 반환
    return {
      ownerId: appointmentInfo?.owner_id,
      time: {
        start_time: appointmentInfo ? appointmentInfo.start_time : null,
        end_time: appointmentInfo ? appointmentInfo.end_time : null,
        member: votedUsers.map((u) => u.nickname), // ✅ 투표 완료한 멤버의 닉네임 반환
        result: timeResults,
      },
      place: {
        member: votedUsers.map((u) => u.nickname), // ✅ 투표 완료한 멤버의 닉네임 반환
        result: placeResults,
      },
    };
  }
}
