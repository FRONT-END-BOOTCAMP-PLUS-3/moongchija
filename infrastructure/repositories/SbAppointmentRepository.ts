import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Appointment {
  title: string;
  quiz: string;
  answer: string;
  start_time: string;
  end_time: string;
  owner_id: string;
  status?: string;
  confirm_time?: string;
  confirm_place?: string;
  confirm_place_url?: string;
  result_time?: any; // JSON 타입
  result_place?: any; // JSON 타입
}

// ✅ 약속 생성
export const createAppointment = async (appointment: Appointment) => {
  const { data, error } = await supabase
    .from("appointment")
    .insert([appointment])
    .select();
  if (error) throw error;
  return data;
};

// ✅ 특정 약속 조회 (ID 기반)
export const getAppointmentById = async (appointmentId: number) => {
  const { data, error } = await supabase
    .from("appointment")
    .select("*")
    .eq("id", appointmentId)
    .single();
  if (error) throw error;
  return data;
};

// ✅ 약속 상태 업데이트 (예: 확정됨, 진행 중, 완료 등)
export const updateAppointmentStatus = async (
  appointmentId: number,
  status: string
) => {
  const { error } = await supabase
    .from("appointment")
    .update({ status })
    .eq("id", appointmentId);
  if (error) throw error;
};

// ✅ 약속 확정 (시간 & 장소 확정)
export const confirmAppointment = async (
  appointmentId: number,
  confirmTime: string,
  confirmPlace: string,
  confirmPlaceUrl: string
) => {
  const { error } = await supabase
    .from("appointment")
    .update({
      confirm_time: confirmTime,
      confirm_place: confirmPlace,
      confirm_place_url: confirmPlaceUrl,
    })
    .eq("id", appointmentId);
  if (error) throw error;
};

// ✅ 약속 삭제
export const deleteAppointment = async (appointmentId: number) => {
  const { error } = await supabase
    .from("appointment")
    .delete()
    .eq("id", appointmentId);
  if (error) throw error;
};
