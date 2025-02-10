import { DfIsMemberUsecase } from "@/application/usecases/member/DfIsMemberUsecase";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
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
  const usecase = new DfIsMemberUsecase(memberRepo);
  const isMember = await usecase.execute(userId, appointmentId);

  if (!isMember) {
    return NextResponse.json(
      { error: "해당 약속의 멤버가 아닙니다." },
      { status: 400 }
    );
  }
  return NextResponse.json(isMember);
};
