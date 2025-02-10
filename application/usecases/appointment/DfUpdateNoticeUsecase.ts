import { NoticeRepository } from "@/domain/repositories/NoticeRepository";

export class DfUpdateNoticeUsecase {
  constructor(private noticeRepository: NoticeRepository) {}

  async execute(noticeId: number, descript: string): Promise<void> {
    if (!noticeId) {
      throw new Error("유효한 공지사항 ID가 필요합니다.");
    }
  console.log("noticeId:" ,noticeId, "descript: ", descript);
  
    if (typeof descript !== "string" || !descript.trim()) {
      throw new Error("공지사항 내용은 비워둘 수 없습니다.");
    }
  
    await this.noticeRepository.update(noticeId, descript);
  }}
