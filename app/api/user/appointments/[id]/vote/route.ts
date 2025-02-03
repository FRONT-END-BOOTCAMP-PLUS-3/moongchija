import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { DfSubmitVoteUsecase } from "@/application/usecases/vote/DfSubmitVoteUsecase";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";

export async function POST(request: NextRequest) {
  try {
    let { appointmentId, userId, timeVotes, placeVotes } = await request.json();

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

    // ✅ 새로 추가할 시간 투표 생성 및 ID 반환
    const newTimeIds = await timeVoteRepo.createTimeVotes(
      appointmentId,
      newTimes.map((vote: { time: string }) => vote.time)
    );

    // ✅ `processedTimeVotes` 생성 (null 방지)
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

    // ✅ 투표 저장 실행
    await voteUsecase.execute({
      userId,
      appointmentId,
      timeVotes: processedTimeVotes,
      placeVotes,
    });

    return NextResponse.json({
      message: "✅ 투표가 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("❌ 투표 저장 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
