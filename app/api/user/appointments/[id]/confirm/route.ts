import { NextRequest, NextResponse } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { DfGetPlaceVotesUsecase } from "@/application/usecases/vote/DfGetPlaceVotesUsecase";
import { DfConfirmAppointmentUseCase } from "@/application/usecases/appointment/DfConfirmUseCase";

export const GET = async (
  request: NextResponse,
  { params }: { params: { id: number } }
) => {
  try {
    const { id } = await params;
    const appointmentId = id;

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
};

export async function POST(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname; // ex) "/api/user/appointments/1/vote-result"
    const appointmentId = parseInt(pathname.split("/").slice(-2, -1)[0]); // 마지막에서 두 번째 값 추출

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const { confirm_time, confirm_place, confirm_place_url } =
      await request.json();

    if (!confirm_time || !confirm_place) {
      return NextResponse.json(
        { error: "필수 정보가 부족합니다." },
        { status: 400 }
      );
    }

    const confirmAppointmentUseCase = new DfConfirmAppointmentUseCase(
      new SbAppointmentRepository()
    );
    await confirmAppointmentUseCase.execute(appointmentId, {
      confirm_time,
      confirm_place,
      confirm_place_url,
    });

    return NextResponse.json({
      message: "✅ 약속이 성공적으로 확정되었습니다.",
    });
  } catch (error) {
    console.error("❌ 약속 확정 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
