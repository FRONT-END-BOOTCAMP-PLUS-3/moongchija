import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { DfSubmitVoteUsecase } from "@/application/usecases/vote/DfSubmitVoteUsecase";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";

export const POST = async (request: NextRequest) => {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]);
    const { userId, timeVotes, placeVotes } = await request.json();

    // 필수 데이터 체크
    if (!userId || !timeVotes.length || !placeVotes.length) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const submitVoteUsecase = new DfSubmitVoteUsecase(
      new SbTimeVoteUserRepository(),
      new SbPlaceVoteUserRepository(),
      new SbMemberRepository(),
      new SbTimeVoteRepository()
    );

    // ✅ placeVotes 유효성 검사
    if (!placeVotes || placeVotes.length === 0 || !placeVotes[0]?.placeId) {
      return NextResponse.json(
        { error: "장소를 선택해주세요." },
        { status: 400 }
      );
    }

    // ✅ 투표 저장 실행 (서버에서 발생하는 오류를 catch하기 위함)
    try {
      await submitVoteUsecase.execute({
        userId,
        appointmentId,
        timeVotes,
        placeVotes,
      });
    } catch (voteError) {
      console.log("❌ 투표 오류 발생:", voteError);
      return NextResponse.json(
        {
          error:
            voteError instanceof Error ? voteError.message : "Unknown error",
        },
        { status: 400 }
      ); // ✅ 400 상태 코드 반환
    }

    return NextResponse.json({
      message: "✅ 투표가 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.log("❌ 투표 저장 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
