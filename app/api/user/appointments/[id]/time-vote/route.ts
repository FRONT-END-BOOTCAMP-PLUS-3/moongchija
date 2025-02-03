import { NextResponse } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { DfAppointmentTimeUsecase } from "@/application/usecases/vote/DfGetAppointmentTimeUsecase.ts";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const repository = new SbAppointmentRepository();
  const usecase = new DfAppointmentTimeUsecase(repository);
  // const appointmentTime = await usecase.execute(parseInt(params.id));
  const { id } = await params;
  const appointmentTime = await usecase.execute(parseInt(id));

  if (!appointmentTime) {
    return NextResponse.json(
      { error: "Appointment not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(appointmentTime);
}
