import { NextResponse, NextRequest } from "next/server";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { DfDeleteMemberUsecase } from "@/application/usecases/appointment/DfDeleteMemberUsecase";

// 멤버 삭제
export async function DELETE(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]);
    const body = await req.json();
    const { userId } = body;

    if (!userId || !appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const memberRepository = new SbMemberRepository();
    const deleteMemberUsecase = new DfDeleteMemberUsecase(memberRepository);
    await deleteMemberUsecase.execute(userId, Number(appointmentId));

    return NextResponse.json(
      { message: "Member deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete member" },
      { status: 500 }
    );
  }
}
