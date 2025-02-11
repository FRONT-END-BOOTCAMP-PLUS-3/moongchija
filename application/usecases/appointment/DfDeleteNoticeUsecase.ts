import { NoticeRepository } from "@/domain/repositories/NoticeRepository";

export class DfDeleteNoticeUsecase {
  constructor(private noticeRepository: NoticeRepository) {}

  async execute(noticeId: number): Promise<void> {
    if (typeof noticeId !== "number" || isNaN(noticeId) || noticeId <= 0) {
      throw new Error("유효한 공지사항 ID가 필요합니다.");
    }
  
    try {
      await this.noticeRepository.delete(noticeId);
    } catch (error) {
      console.log("공지사항 삭제 실패:", error);
      throw new Error("공지사항 삭제에 실패했습니다.");
    }
  }
}
