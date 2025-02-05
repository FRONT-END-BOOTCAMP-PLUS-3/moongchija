import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { DfSubmitVoteUsecase } from "@/application/usecases/vote/DfSubmitVoteUsecase";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { TimeVoteDto } from "@/application/usecases/vote/dto/VoteDto";

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

    // ✅ page에서 받은 time(YYYY-MM-DD HH:MM:SS)이 time_vote테이블에 존재하면 time_id반환 없으면 null반환
    const existingTimeVotes = await Promise.all(
      timeVotes.map(async (vote: { time: string }) => {
        const existingTimeId = await timeVoteRepo.findTimeIdByTimestamp(
          appointmentId,
          vote.time
        );
        return existingTimeId ? { timeId: existingTimeId } : null;
      })
    );

    // ✅ page에서 받은 time들 가운데 time_id가 없는 것듯은 nuwTimes에 저장
    const newTimes = timeVotes.filter(
      (_: { time: string }, index: number) => !existingTimeVotes[index]
    );

    // ✅ 새로운 시간들을 DB에 추가하고 ID 리스트 가져오기
    const newTimeIds = await timeVoteRepo.createTimeVotes(
      appointmentId,
      newTimes.map((vote: { time: string }) => vote.time)
    );

    // ✅ null 값을 newTimeIds에서 가져올 때 올바르게 매핑
    const processedTimeVotes: TimeVoteDto[] = existingTimeVotes
      .map((vote, index) => {
        if (vote) {
          return vote; // ✅ 기존 time_id가 있으면 그대로 사용
        } else {
          const newTimeId = newTimeIds.shift();
          if (!newTimeId) {
            throw new Error("새로운 timeId 매핑 중 오류 발생"); // ✅ 예외 처리 추가
          }
          return { timeId: newTimeId }; // ✅ 새로 추가한 timeId 매핑
        }
      })
      .filter((vote): vote is TimeVoteDto => vote !== null); // ✅ `null` 필터링

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
