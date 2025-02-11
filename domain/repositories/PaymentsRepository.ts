import { Payments } from "../entities/Payments";

export interface PaymentsRepository {
  // 정산 정보 생성
  create(
    appointmentId: number,
    accountNumber: string,
    accountHolderName: string,
    bank: string,
    memberCount: number
  ): Promise<void>;

  // 특정 약속(appointment)의 정산 정보 조회
  findByAppointmentId(appointmentId: number): Promise<Payments | null>;


  // 정산 정보 삭제
  delete(paymentsId: number): Promise<void>;
}
