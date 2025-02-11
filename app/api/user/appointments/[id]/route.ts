import { DfAccessUsecase } from "@/application/usecases/appointment/DfAccessUsecase";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const urlParts = request.nextUrl.pathname.split("/");
  const appointmentId = Number(urlParts[urlParts.length - 1]);

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") as string;

  const memberRepo = new SbMemberRepository();
  const userRepo = new SbUserRepository();
  const accessUsecase = new DfAccessUsecase(memberRepo, userRepo);
  const isAccess = await accessUsecase.execute({ appointmentId, userId });

  if (!isAccess) {
    return NextResponse.json(
      { error: "해당 약속에 접근 권한이 없습니다." },
      { status: 400 }
    );
  }
  return NextResponse.json(isAccess);
};
