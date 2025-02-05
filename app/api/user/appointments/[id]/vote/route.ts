import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { DfSubmitVoteUsecase } from "@/application/usecases/vote/DfSubmitVoteUsecase";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: number } }
) {
  try {
    const { id } = await params;
    const appointmentId = id;
    let { userId, timeVotes, placeVotes } = await request.json();

    // 필수 데이터 체크
    if (!userId || !timeVotes.length || !placeVotes.length) {
      return NextResponse.json(
        { error: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const timeVoteRepo = new SbTimeVoteRepository();
    const voteUsecase = new DfSubmitVoteUsecase(
      new SbTimeVoteUserRepository(),
      new SbPlaceVoteUserRepository(),
      new SbMemberRepository()
    );

    // ✅ `timeVotes`에서 `timeId`를 찾고, 없으면 생성하는 최적화된 코드
    const existingTimeVotes = await Promise.all(
      timeVotes.map(async (vote: { time: string }) => {
        const existingTimeId = await timeVoteRepo.findTimeIdByTimestamp(
          appointmentId,
          vote.time
        );
        return existingTimeId ? { timeId: existingTimeId } : null;
      })
    );

    const newTimes = timeVotes.filter(
      (_: { time: string }, index: number) => !existingTimeVotes[index]
    );

    // ✅ 새로운 시간들을 DB에 추가하고 ID 리스트 가져오기
    const newTimeIds = await timeVoteRepo.createTimeVotes(
      appointmentId,
      newTimes.map((vote: { time: string }) => vote.time)
    );

    // ✅ 기존 `existingTimeVotes`와 새로 추가된 `newTimeIds`를 정확하게 매칭
    const processedTimeVotes = existingTimeVotes.map(
      (vote, index) => (vote ? vote : { timeId: newTimeIds[index] ?? null }) // null 방지
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
      await voteUsecase.execute({
        userId,
        appointmentId,
        timeVotes: processedTimeVotes,
        placeVotes,
      });
    } catch (voteError) {
      console.error("❌ 투표 오류 발생:", voteError);
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
    console.error("❌ 투표 저장 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
