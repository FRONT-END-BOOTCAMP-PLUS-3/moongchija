import { Appointment } from "../entities/Appointment";

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment[]>; // 약속 생성
  findById(appointmentId: number): Promise<Appointment | null>; // 특정 약속 조회
  findByOwner(ownerId: string): Promise<Appointment[]>; // 특정 사용자의 약속 목록 조회
  updateStatus(appointmentId: number, status: string): Promise<void>; // 약속 상태 업데이트
  confirm(
    appointmentId: number,
    confirmTime: string,
    confirmPlace: string,
    confirmPlaceUrl: string
  ): Promise<void>; // 약속 확정
  delete(appointmentId: number): Promise<void>; // 약속 삭제
}
