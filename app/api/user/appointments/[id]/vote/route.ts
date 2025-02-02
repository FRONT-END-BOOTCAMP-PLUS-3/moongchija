import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ 현재 로그인된 유저 가져오기
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const appointmentId = parseInt(params.id);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const { timeVotes, placeVotes } = await req.json();

    const timeVoteRepo = new SbTimeVoteUserRepository();
    const placeVoteRepo = new SbPlaceVoteUserRepository();

    // ✅ 시간 투표 저장
    for (const timeVote of timeVotes) {
      await timeVoteRepo.voteForTime(userId, timeVote.time);
    }

    // ✅ 장소 투표 저장
    for (const placeVote of placeVotes) {
      await placeVoteRepo.voteForPlace(userId, placeVote.place);
    }

    return NextResponse.json({ message: "Vote submitted successfully!" });
  } catch (error) {
    console.error("Error submitting vote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
