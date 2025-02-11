import { DfCreateAppointmentUsecase } from "@/application/usecases/appointment/DfCreateAppointmentUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appointment, placeVotes } = body;

    if (!appointment || !placeVotes) {
      console.error("❌ 필수 데이터 누락:", { appointment, placeVotes });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const appointmentRepository = new SbAppointmentRepository();
    const placeVoteRepository = new SbPlaceVoteRepository();
    const memberRepository = new SbMemberRepository();

    const usecase = new DfCreateAppointmentUsecase(
      appointmentRepository,
      placeVoteRepository,
      memberRepository
    );

    const newAppointment = await usecase.execute(appointment, placeVotes);

    return NextResponse.json(newAppointment, { status: 201 });
  } catch (error) {
    console.error("❌ Error creating appointment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
