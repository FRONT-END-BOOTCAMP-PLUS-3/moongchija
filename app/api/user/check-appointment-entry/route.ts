import { DfCheckAppointmentEntryUsecase } from "@/application/usecases/appointment/DfCheckAppointmentEntryUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
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

    const appointmentRepository = new SbAppointmentRepository();
    const memberRepository = new SbMemberRepository();

    const useCase = new DfCheckAppointmentEntryUsecase(appointmentRepository, memberRepository);

    const isMember = await useCase.execute(Number(appointmentId), userId);

    if (isMember) {
      return NextResponse.json(
        { error: "이미 해당 방에 참여한 사용자입니다." },
        { status: 403 }
      );
    }

    return NextResponse.json({ redirect: `/user/appointments/${appointmentId}/entry` });

  } catch (error) {
    console.log("❌ Error checking vote status:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}