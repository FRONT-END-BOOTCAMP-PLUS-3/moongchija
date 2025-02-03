export interface MemberRepository {
  addMemberToAppointment(userId: string, appointmentId: number): Promise<void>; // 약속에 멤버로 추가
  isUserInAppointment(userId: string, appointmentId: number): Promise<boolean>; // 약속의 멤버인지 확인 (멤버는 재투표 불가)
}
