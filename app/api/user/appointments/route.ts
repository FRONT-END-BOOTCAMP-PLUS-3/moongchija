import { DfAppointmentCardUsecase } from "@/application/usecases/appointment/DfGetAppointmentCardUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userRepository = new SbUserRepository();
    const memberRepository = new SbMemberRepository();
    const appointmentRepository = new SbAppointmentRepository();

    const usecase = new DfAppointmentCardUsecase(
      userRepository,
      memberRepository,
      appointmentRepository
    );

    const appointments = await usecase.execute();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
