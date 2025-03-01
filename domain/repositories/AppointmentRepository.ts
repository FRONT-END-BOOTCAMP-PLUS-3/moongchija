import { Appointment } from "../entities/Appointment";

export interface AppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>; // 약속 생성
  findById(appointmentId: number): Promise<Appointment | null>; // 특정 약속 조회
  getAppointmentTime(
    appointmentId: number
  ): Promise<Partial<Appointment> | null>; // 특정 약속의 start_time, end_time을 가져오는 함수

  findByIds(appointmentId: number[]): Promise<Appointment[] | null>; // 특정 약속 리스트 조회

  findByOwner(ownerId: string): Promise<Appointment[]>; // 특정 사용자의 약속 목록 조회

  updateStatus(appointmentId: number, status: string): Promise<void>; // 약속 상태 업데이트

  confirmAppointment(
    appointmentId: number,
    confirmData: {
      confirm_time: string;
      confirm_place: string;
      confirm_place_url: string;
      status: string;
    }
  ): Promise<void>; // 약속 확정
  getAllAppointments(): Promise<Appointment[]>;
  deleteAppointment(id: number): Promise<boolean>;
}
