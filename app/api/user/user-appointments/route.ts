import { DfGetUserAppointmentsUsecase } from "@/application/usecases/appointment/DfGetUserAppointmentsUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  const cookieStore = cookies();
  const userId = (await cookieStore).get("userId")?.value || null;

  if (!userId) {
    return { error: "유저 ID가 없습니다." };
  }

  const userRepository = new SbUserRepository();
  const memberRepository = new SbMemberRepository();
  const appointmentRepository = new SbAppointmentRepository();

  const usecase = new DfGetUserAppointmentsUsecase(
    userRepository,
    appointmentRepository,
    memberRepository
  );

  const appointments = await usecase.execute(userId);

  return NextResponse.json(appointments);
};
