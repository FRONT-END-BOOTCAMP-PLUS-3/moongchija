import { NextRequest, NextResponse } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { DfDeleteAppointmentUsecase } from "@/application/usecases/appointment/DfDeleteAppointmentUsecase";

// ✅ DELETE: 약속 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "약속 ID가 없습니다." },
        { status: 400 }
      );
    }

    const appointmentRepo = new SbAppointmentRepository();
    const deleteAppointmentUsecase = new DfDeleteAppointmentUsecase(
      appointmentRepo
    );

    const isDeleted = await deleteAppointmentUsecase.execute(id);

    if (!isDeleted) {
      return NextResponse.json({ error: "약속 삭제 실패" }, { status: 404 });
    }

    return NextResponse.json({ message: "약속이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("❌ 약속 삭제 중 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
