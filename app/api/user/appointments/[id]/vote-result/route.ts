import { NextRequest, NextResponse } from "next/server";
import { SbTimeVoteUserRepository } from "@/infrastructure/repositories/SbTimeVoteUserRepository";
import { SbPlaceVoteUserRepository } from "@/infrastructure/repositories/SbPlaceVoteUserRepository";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbTimeVoteRepository } from "@/infrastructure/repositories/SbTimeVoteRepository";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { DfGetVoteResultUseCase } from "@/application/usecases/vote/DfGetVoteResultUsecase";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";

export const GET = async (req: NextRequest) => {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]);

    if (isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const voteResultUseCase = new DfGetVoteResultUseCase(
      new SbMemberRepository(),
      new SbUserRepository(),
      new SbTimeVoteUserRepository(),
      new SbPlaceVoteUserRepository(),
      new SbAppointmentRepository(),
      new SbTimeVoteRepository(),
      new SbPlaceVoteRepository()
    );

    const voteResult = await voteResultUseCase.execute(appointmentId);

    return NextResponse.json(voteResult);
  } catch (error) {
    console.log("❌ 투표 결과 조회 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
