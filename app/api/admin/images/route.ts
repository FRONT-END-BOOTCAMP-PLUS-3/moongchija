import { NextRequest, NextResponse } from "next/server";
import { SbAppointmentImageRepository } from "@/infrastructure/repositories/SbAppointmentImageRepository";
import { ImageListDto } from "@/application/usecases/appointmentImage/dto/ImageListDto";
import { DfGetAllImagesUsecase } from "@/application/usecases/appointmentImage/DfGetAllImagesUsecase";

// ✅ GET: 이미지 목록 조회
export async function GET(request: NextRequest) {
  try {
    const imageRepo = new SbAppointmentImageRepository();
    const getAllImagesUseCase = new DfGetAllImagesUsecase(imageRepo);
    const images: ImageListDto[] = await getAllImagesUseCase.execute();

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json(
      { error: (error as any).message },
      { status: 500 }
    );
  }
}
