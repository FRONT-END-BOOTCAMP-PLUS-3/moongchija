import { Member } from "./../entities/Member";

export interface MemberRepository {
  addMemberToAppointment(userId: string, appointmentId: number): Promise<void>; // 약속에 멤버로 추가

  isUserInAppointment(userId: string, appointmentId: number): Promise<boolean>; // 약속의 멤버인지 확인 (멤버는 재투표 불가)

  findByUserId(userId: string): Promise<Member[]>;

  findByAppointmentId(appointmentId: number): Promise<Member[]>;

  getMemberStatus(
    userId: string,
    appointmentId: number
  ): Promise<{
    is_vote: boolean;
  } | null>;

  updateVoteStatus(
    userId: string,
    appointmentId: number,
    isVote: boolean
  ): Promise<void>;

  getVotedMemberIdsByAppointment(appointmentId: number): Promise<string[]>;
}
