import { NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { DfSubmitVoteUsecase } from "@/application/usecases/appointment/DfSubmitVoteUsecase";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const appointmentId = parseInt(params.id);
    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "잘못된 약속 ID입니다." },
        { status: 400 }
      );
    }

    const { userId, timeVotes, placeVotes } = await request.json(); // ✅ userId 클라이언트에서 받아오기
    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const voteUsecase = new DfSubmitVoteUsecase(
      new SbTimeVoteUserRepository(),
      new SbPlaceVoteUserRepository()
    );

    await voteUsecase.execute({
      userId, // ✅ userId를 여기에서 포함
      appointmentId,
      timeVotes,
      placeVotes,
    });

    return NextResponse.json({ message: "투표가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("❌ 투표 저장 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
