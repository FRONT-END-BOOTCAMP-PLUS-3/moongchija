export interface Appointment {
  id?: number; // 약속 ID (Primary Key)
  confirm_time?: string | null; // 확정된 시간
  confirm_place?: string | null; // 확정된 장소
  confirm_place_url?: string | null; // 확정된 장소 URL
  status: string; // 약속 상태 (예: 대기중, 확정됨)
  title: string; // 약속 제목
  quiz?: string | null; // 입장 퀴즈 질문
  answer?: string | null; // 입장 퀴즈 정답
  start_time: string; // 약속 시작 시간
  end_time: string; // 약속 종료 시간
  created_at?: string; // 생성 날짜
  owner_id: string; // 방장 (생성자) ID
}
