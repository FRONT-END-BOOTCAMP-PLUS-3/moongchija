import { NextRequest, NextResponse } from "next/server";
import { SbAppointmentImageRepository } from "@/infrastructure/repositories/SbAppointmentImageRepository";
import { DfDeleteImageUsecase } from "@/application/usecases/appointmentImage/DfDeleteImageUsecase";

// ✅ DELETE: 이미지 삭제
export const DELETE = async (request: NextRequest) => {
  try {
    const urlParts = request.nextUrl.pathname.split("/");
    const imageId = Number(urlParts[urlParts.length - 1]);

    if (!imageId) {
      return NextResponse.json(
        { error: "이미지 ID가 없습니다." },
        { status: 400 }
      );
    }

    const imageRepository = new SbAppointmentImageRepository();
    const deleteImageUsecase = new DfDeleteImageUsecase(imageRepository);
    const isDeleted = await deleteImageUsecase.execute(imageId);

    if (!isDeleted) {
      return NextResponse.json({ error: "이미지 삭제 실패" }, { status: 404 });
    }

    return NextResponse.json({
      message: "이미지가 성공적으로 삭제되었습니다.",
    });
  } catch (error) {
    console.error("❌ 이미지 삭제 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
};
