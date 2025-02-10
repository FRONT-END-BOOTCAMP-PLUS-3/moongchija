import { NoticeRepository } from "@/domain/repositories/NoticeRepository";

export class DfCreateNoticeUsecase {


  constructor(private noticeRepository: NoticeRepository) {

  }

  async execute(descript: string, appointmentId: number): Promise<void> {
    if (!descript.trim()) {
      throw new Error("공지사항 내용은 비워둘 수 없습니다.");
    }

    if (!appointmentId) {
      throw new Error("유효한 약속 ID가 필요합니다.");
    }

    await this.noticeRepository.create(descript, appointmentId);
  }
}
