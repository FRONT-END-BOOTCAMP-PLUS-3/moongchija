import { DfGetMemberIsVote } from "@/application/usecases/member/DfGetMemberIsVote";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const userId = searchParams.get("userId");

    if (!appointmentId || !userId) {
      throw new Error("Both appointmentId and userId are required");
    }

    const memberRepository = new SbMemberRepository();
    const useCase = new DfGetMemberIsVote(memberRepository);

    // 투표 상태 확인
    const resultPath = await useCase.execute(Number(appointmentId), userId);

    // 리디렉션할 경로를 반환
    return NextResponse.json({ redirect: resultPath });

  } catch (error) {
    console.error("❌ Error checking vote status:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// const checkVoteStatus = async () => {
//     try {
//       const response = await fetch(
//         `/api/check-vote-status?appointmentId=${appointmentId}&userId=${userId}`
//       );
//       const data = await response.json();

//       if (data?.redirect) {
//         setRedirectPath(data.redirect);
//       } else {
//         setError("Failed to fetch vote status.");
//       }
//     } catch (err) {
//       setError("An error occurred while checking vote status.");
//     } finally {
//       setLoading(false);
//     }
//   };