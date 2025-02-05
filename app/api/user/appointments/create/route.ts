import { DfCreateAppointmentUsecase } from "@/application/usecases/appointment/DfCreateAppointmentUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbPlaceVoteRepository } from "@/infrastructure/repositories/SbPlaceVoteRepository";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { appointment, placeVotes } = await req.json();

    if (!appointment || !placeVotes) {
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
