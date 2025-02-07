import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentImageRepository } from "@/infrastructure/repositories/SbAppointmentImageRepository";
import { DfGetImageUsecase } from "@/application/usecases/appointmentImage/DfGetImageUsecase";

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
    const usecase = new DfGetImageUsecase(imageRepo);

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
