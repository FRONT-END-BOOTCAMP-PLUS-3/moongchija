import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { DfGetAppointmentUsecase } from "@/application/usecases/appointment/DfGetAppointmentUsecase";
import DfEntryMemberUsecases from "@/application/usecases/member/DfEntryMemberUsecases";


export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); 

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const appointmentRepository = new SbAppointmentRepository();

    const usecase = new DfGetAppointmentUsecase(appointmentRepository);
    const appointment = await usecase.execute(appointmentId);

    return NextResponse.json(appointment, { status: 200 });

  } catch (error) {
    console.log("Error in POST  :", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); 

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    console.log("📥 받은 요청 데이터:", body);

    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing required field userId" },
        { status: 400 }
      );
    }

    const memberRepository = new SbMemberRepository();

    const usecase = new DfEntryMemberUsecases(memberRepository);
    await usecase.execute(appointmentId, userId);

    return NextResponse.json(
      { message: "Member added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in POST /user/appointment/[id]/entry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}