import { NextRequest, NextResponse } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { DfGetAppointmentTimeUsecase } from "@/application/usecases/vote/DfGetAppointmentTimeUsecase.ts";

export const GET = async (req: NextRequest) => {
  const repository = new SbAppointmentRepository();
  const usecase = new DfGetAppointmentTimeUsecase(repository);
  const urlParts = req.nextUrl.pathname.split("/");
  const appointmentId = Number(urlParts[urlParts.length - 2]);
  const appointmentTime = await usecase.execute(appointmentId);

  if (!appointmentTime) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointmentTime);
};
