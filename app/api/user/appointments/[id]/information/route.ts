import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfGetAppointmentInformationUsecase } from "@/application/usecases/appointment/DfGetAppointmentInformationUsecase";
import { SbNoticeRepository } from "@/infrastructure/repositories/SbNoticeRepository";

export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); // '/api/user/appointments/[id]/information'에서 [id] 추출

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const appointmentRepository = new SbAppointmentRepository();
    const memberRepository = new SbMemberRepository();
    const userRepository = new SbUserRepository();
    const noticeRepository = new SbNoticeRepository();

    const usecase = new DfGetAppointmentInformationUsecase(
      appointmentRepository,
      memberRepository,
      userRepository,
      noticeRepository,
    );

    const appointmentInfo = await usecase.execute(appointmentId);

    if (!appointmentInfo) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointmentInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}
