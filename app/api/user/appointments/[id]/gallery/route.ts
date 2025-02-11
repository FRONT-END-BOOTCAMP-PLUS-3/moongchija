import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentImageRepository } from "@/infrastructure/repositories/SbAppointmentImageRepository";
import { DfGetImageUsecase } from "@/application/usecases/appointmentImage/DfGetImageUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfCreateImageUsecase } from "@/application/usecases/appointmentImage/DfCreateImageUsecase";

export async function GET(req: NextRequest, { params }: { params: { id: number } }) {
  try {
    const { id } = await params;
    const appointmentId = id;


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
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const appointmentId = formData.get("appointment_id");
    const createrId = formData.get("creater_id");

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "올바른 이미지 형식이 아닙니다." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "파일 크기가 너무 큽니다. (최대 5MB)" }, { status: 413 });
    }

    if (!appointmentId || isNaN(Number(appointmentId)) || Number(appointmentId) <= 0) {
      return NextResponse.json({ error: "유효하지 않은 약속 ID입니다." }, { status: 400 });
    }

    if (!createrId) {
      return NextResponse.json({ error: "생성자 ID가 없습니다." }, { status: 400 });
    }


    const repository = new SbAppointmentImageRepository();
    const usecase = new DfCreateImageUsecase(repository);

    const uploadedImage = await usecase.execute({
      appointment_id: Number(appointmentId),
      creater_id: String(createrId),
      file,
    });

    return NextResponse.json(uploadedImage);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "이미지 업로드 실패" }, { status: 500 });
  }
}