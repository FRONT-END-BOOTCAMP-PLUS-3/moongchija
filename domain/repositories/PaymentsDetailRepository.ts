import { PaymentsDetail } from "../entities/PaymentsDetail";

export interface PaymentsDetailRepository {
  // 특정 정산(Payments)에 대한 세부 결제 내역 생성
  create(paymentsId: number, amount: number, descript: string): Promise<void>;

  // 특정 정산(Payments)에 대한 세부 결제 내역 조회
  findByPaymentsId(paymentsId: number): Promise<PaymentsDetail[]>;
}
