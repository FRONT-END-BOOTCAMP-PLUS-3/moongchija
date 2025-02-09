import { PaymentsRepository } from "@/domain/repositories/PaymentsRepository";
import { PaymentsDetailRepository } from "@/domain/repositories/PaymentsDetailRepository";

export class DfUpdateSettlementUsecase {
  constructor(
    private paymentsRepository: PaymentsRepository,
    private paymentsDetailRepository: PaymentsDetailRepository
  ) {}


  async execute(
    appointmentId: number,
    accountNumber: string,
    accountHolderName: string,
    bank: string,
    memberCount: number,
    details: { amount: number; descript: string }[]
  ): Promise<void> {
    // 입력값 유효성 검사
    if (!accountNumber.trim()) {
      throw new Error("계좌번호는 비워둘 수 없습니다.");
    }
    if (!accountHolderName.trim()) {
      throw new Error("예금주명은 비워둘 수 없습니다.");
    }
    if (!bank.trim()) {
      throw new Error("은행 정보는 비워둘 수 없습니다.");
    }
    if (!appointmentId) {
      throw new Error("유효한 약속 ID가 필요합니다.");
    }

    // 기존 정산 정보 조회 (한 약속 당 하나의 정산 정보라고 가정)
    const existingPayment = await this.paymentsRepository.findByAppointmentId(appointmentId);
    if (existingPayment && existingPayment.id) {
      // 기존 정산 정보 삭제
      await this.paymentsRepository.delete(existingPayment.id);
    }

    // 새 정산 정보 생성
    await this.paymentsRepository.create(
      appointmentId,
      accountNumber,
      accountHolderName,
      bank,
      memberCount
    );

    // 새로 생성된 정산 정보를 조회 (한 약속 당 하나의 정산 정보라고 가정)
    const newPayment = await this.paymentsRepository.findByAppointmentId(appointmentId);
    if (!newPayment || !newPayment.id) {
      throw new Error("정산 정보를 생성하지 못했습니다.");
    }

    // 세부 내역 생성 (각 세부 내역에 대해 유효성 검사 후 생성)
    for (const detail of details) {
      if (typeof detail.amount !== "number" || isNaN(detail.amount)) {
        throw new Error("유효한 금액을 입력해주세요.");
      }
      if (!detail.descript.trim()) {
        throw new Error("세부 내역 설명은 비워둘 수 없습니다.");
      }
      await this.paymentsDetailRepository.create(newPayment.id, detail.amount, detail.descript);
    }
  }
}
