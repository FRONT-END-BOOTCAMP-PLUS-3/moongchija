import { NextRequest, NextResponse } from "next/server";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { createClient } from "@/utils/supabase/server";
import { DfGetPlaceVotesUsecase } from "@/application/usecases/vote/DfGetPlaceVotesUsecase";

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname; // ex) "/api/user/appointments/1/vote-result"
    const appointmentId = parseInt(pathname.split("/").slice(-2, -1)[0]); // 마지막에서 두 번째 값 추출

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const getPlaceVotesUsecase = new DfGetPlaceVotesUsecase(
      new SbPlaceVoteRepository()
    );
    const places = await getPlaceVotesUsecase.execute(appointmentId);

    return NextResponse.json(places);
  } catch (error) {
    console.error("❌ 장소 투표 리스트 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
