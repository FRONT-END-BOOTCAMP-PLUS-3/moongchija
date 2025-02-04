import { Notice } from "../entities/Notice";

export interface NoticeRepository {
  create(descript: string, appointmentId: number): Promise<void>; // 공지사항 생성

  findById(appointmentId: number): Promise<Notice[] | null>; // 공지사항 목록 보여줌
 
  update(noticeId: number, descript: string): Promise<void>; // 공지사항 수정

  delete(noticeId: number): Promise<void>; // 공지사항 삭제
}
