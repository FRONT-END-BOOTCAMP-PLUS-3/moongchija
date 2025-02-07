export interface AppointmentListDto {
  id: number | undefined;
  title: string;
  status: string;
  confirm_time: string | null | undefined; // 확정 시간이 없을 수도 있음
  created_at: string | undefined;
}
