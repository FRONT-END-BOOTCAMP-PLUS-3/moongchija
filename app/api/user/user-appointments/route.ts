import { DfGetUserAppointmentsUsecase } from "@/application/usecases/appointment/DfGetUserAppointmentsUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value || null;

  if (!userId) {
    return NextResponse.json({ error: "유저 ID가 없습니다." }, { status: 401 });
  }

  const memberRepository = new SbMemberRepository();
  const appointmentRepository = new SbAppointmentRepository();

  const usecase = new DfGetUserAppointmentsUsecase(
    appointmentRepository,
    memberRepository
  );

  const appointments = await usecase.execute(userId);

  return NextResponse.json(appointments);
};
