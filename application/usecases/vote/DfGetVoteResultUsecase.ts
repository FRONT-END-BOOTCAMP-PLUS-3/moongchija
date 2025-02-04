import { TimeVoteUserRepository } from "@/domain/repositories/TimeVoteUserRepository";
import { PlaceVoteUserRepository } from "@/domain/repositories/PlaceVoteUserRepository";
import { AppointmentRepository } from "@/domain/repositories/AppointmentRepository";
import { TimeVoteRepository } from "@/domain/repositories/TimeVoteRepository";
import { PlaceVoteRepository } from "@/domain/repositories/PlaceVoteRepository";

export class DfGetVoteResultUseCase {
  constructor(
    private timeVoteUserRepo: TimeVoteUserRepository,
    private placeVoteUserRepo: PlaceVoteUserRepository,
    private appointmentRepo: AppointmentRepository,
    private timeVoteRepo: TimeVoteRepository,
    private placeVoteRepo: PlaceVoteRepository
  ) {}

  async execute(appointmentId: number) {
    // ✅ 1. 해당 약속의 모든 멤버 조회 (nickname 포함)
    const members = await this.appointmentRepo.getMembersByAppointment(
      appointmentId
    );

    // ✅ 2. 해당 약속의 시간 투표 결과 조회
    const timeVotes = await this.timeVoteRepo.getTimeVotesByAppointment(
      appointmentId
    );

    // ✅ 3. 각 시간별 투표자 조회 (nickname 포함)
    const timeResults = await Promise.all(
      timeVotes.map(async (timeVote) => {
        const users = await this.timeVoteUserRepo.getUsersByTime(timeVote.id);
        return {
          date: timeVote.time,
          user: users.map((user) => user.nickname), // ✅ nickname 반환
        };
      })
    );

    // ✅ 4. 해당 약속의 장소 투표 결과 조회
    const placeVotes = await this.placeVoteRepo.getPlacesByAppointment(
      appointmentId
    );

    // ✅ 5. 각 장소별 투표자 조회 (nickname 포함)
    const placeResults = await Promise.all(
      placeVotes.map(async (placeVote) => {
        const users = await this.placeVoteUserRepo.getUsersByPlace(
          placeVote.id
        );
        return {
          place: placeVote.place,
          place_url: placeVote.place_url,
          user: users.map((user) => user.nickname), // ✅ nickname 반환
        };
      })
    );

    // ✅ 6. 약속 정보에서 start_time, end_time 가져오기 위함
    const appointmentInfo = await this.appointmentRepo.findById(appointmentId);

    // ✅ 7. 최종 결과 데이터 반환
    return {
      time: {
        start_time: appointmentInfo ? appointmentInfo.start_time : null,
        end_time: appointmentInfo ? appointmentInfo.end_time : null,
        member: members.map((m) => m.nickname), // ✅ 멤버 닉네임 포함
        result: timeResults,
      },
      place: {
        member: members.map((m) => m.nickname), // ✅ 멤버 닉네임 포함
        result: placeResults,
      },
    };
  }
}
