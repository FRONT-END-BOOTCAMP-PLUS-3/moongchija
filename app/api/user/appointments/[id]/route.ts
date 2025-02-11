import { DfAccessUsecase } from "@/application/usecases/appointment/DfIsMemberUsecase";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { id: number } }
) => {
  const { id } = await params;
  const appointmentId = id;
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
