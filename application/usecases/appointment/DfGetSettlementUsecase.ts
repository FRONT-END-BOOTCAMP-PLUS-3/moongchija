import { PaymentsRepository } from "@/domain/repositories/PaymentsRepository";
import { PaymentsDetailRepository } from "@/domain/repositories/PaymentsDetailRepository";
import { SettlementDto } from "./dto/SettlementDto";

export class DfGetSettlementUsecase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private paymentsDetailRepository: PaymentsDetailRepository
  ) { }

  async execute(appointmentId: number): Promise<SettlementDto | null> {
    // 정산 정보 조회
    const payment = await this.paymentsRepository.findByAppointmentId(appointmentId);
    if (!payment) {
      return null;
    }

    // 해당 정산 정보에 대한 세부 결제 내역 조회
    const paymentDetails = await this.paymentsDetailRepository.findByPaymentsId(payment.id);

    // SettlementDto로 변환하여 반환
    return {
      id: payment.id,
      accountNumber: payment.account_number,
      accountHolderName: payment.account_holder_name,
      bank: payment.bank,
      appointmentId: payment.appointment_id,
      memberCount: payment.member_count,
      createdAt: payment.created_at,
      details: paymentDetails.map((detail) => ({
        id: detail.id,
        amount: detail.amount,
        descript: detail.descript,
        createdAt: detail.created_at,
      })),
    }
  }
}
