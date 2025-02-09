import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentImageRepository } from "@/infrastructure/repositories/SbAppointmentImageRepository";
import { DfGetImageUsecase } from "@/application/usecases/appointmentImage/DfGetImageUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfCreateImageUsecase } from "@/application/usecases/appointmentImage/DfCreateImageUsecase";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = await params;
    const appointmentId = id;
    console.log(appointmentId);


    if (isNaN(appointmentId) || appointmentId <= 0) {
      return NextResponse.json(
        { error: "유효하지 않은 약속 ID입니다." },
        { status: 400 }
      );
    }

    const imageRepo = new SbAppointmentImageRepository();
    const userRepo = new SbUserRepository();
    const usecase = new DfGetImageUsecase(imageRepo, userRepo);

    // 특정 약속의 이미지 조회
    const images = await usecase.execute(appointmentId);

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "서버 내부 오류 발생" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { appointment_id, image_url, creater_id } = body;
    if (!appointment_id || !image_url || !creater_id) {
      return NextResponse.json(
        { error: "필수 필드(appointment_id, image_url, creater_id)가 누락되었습니다." },
        { status: 400 }
      );
    }

    const imageRepo = new SbAppointmentImageRepository();
    const createUsecase = new DfCreateImageUsecase(imageRepo);
    const createdImage = await createUsecase.execute({
      appointment_id,
      image_url,
      creater_id,
    });

    return NextResponse.json(createdImage, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "서버 내부 오류 발생" },
      { status: 500 }
    );
  }
}