import { NextRequest, NextResponse } from "next/server";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: NextRequest) {
  try {
    // ✅ URL에서 안전하게 appointmentId 추출
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); // '/api/user/appointments/[id]/place-vote'에서 [id] 추출

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    // ✅ Supabase 클라이언트 생성
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 현재 로그인된 유저 확인
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 약속 ID에 해당하는 장소 투표 리스트 조회
    const repository = new SbPlaceVoteRepository();
    const places = await repository.getPlacesByAppointment(appointmentId);

    return NextResponse.json(places);
  } catch (error) {
    console.error("❌ Error fetching place votes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
