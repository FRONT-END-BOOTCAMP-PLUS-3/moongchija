import { NextResponse, NextRequest } from "next/server";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { SbNoticeRepository } from "@/infrastructure/repositories/SbNoticeRepository";
import { DfGetAppointmentInformationUsecase } from "@/application/usecases/appointment/DfGetAppointmentInformationUsecase";
import { DfCreateNoticeUsecase } from "@/application/usecases/appointment/DfCreateNoticeUsecase";
import { DfUpdateNoticeUsecase } from "@/application/usecases/appointment/DfUpdateNoticeUsecase";
import { DfDeleteNoticeUsecase } from "@/application/usecases/appointment/DfDeleteNoticeUsecase";

const appointmentRepository = new SbAppointmentRepository();
const memberRepository = new SbMemberRepository();
const userRepository = new SbUserRepository();
const noticeRepository = new SbNoticeRepository();

// 약속 정보 불러오기 (공지사항 포함)
export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); // '/api/user/appointments/[id]/information'에서 [id] 추출

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const usecase = new DfGetAppointmentInformationUsecase(
      appointmentRepository,
      memberRepository,
      userRepository,
      noticeRepository
    );

    const appointmentInfo = await usecase.execute(appointmentId);

    if (!appointmentInfo) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(appointmentInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 공지사항 생성
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { descript, appointmentId } = body;

    const parsedAppointmentId = Number(appointmentId);
    if (!descript || isNaN(parsedAppointmentId)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    const createNoticeUsecase = new DfCreateNoticeUsecase(noticeRepository);
    await createNoticeUsecase.execute(descript, appointmentId);

    return NextResponse.json({ message: "Notice created successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create notice" },
      { status: 500 }
    );
  }
}

// 공지사항 수정
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { descript, noticeId } = body;

    if (!descript || isNaN(noticeId)) {
      return NextResponse.json(
        { error: "잘못된 요청 데이터입니다" },
        { status: 400 }
      );
    }

    const updateNoticeUsecase = new DfUpdateNoticeUsecase(noticeRepository);
    await updateNoticeUsecase.execute(noticeId, descript);

    return NextResponse.json({ message: "공지사항이 수정되었습니다" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "공지사항 수정에 실패했습니다" },
      { status: 500 }
    );
  }
}

// 공지사항 삭제
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { noticeId } = body;

    if (!noticeId || isNaN(noticeId)) {
      return NextResponse.json(
        { error: "잘못된 요청 데이터입니다" },
        { status: 400 }
      );
    }

    const deleteNoticeUsecase = new DfDeleteNoticeUsecase(noticeRepository);
    await deleteNoticeUsecase.execute(noticeId);

    return NextResponse.json({ message: "공지사항이 삭제되었습니다" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "공지사항 삭제에 실패했습니다" },
      { status: 500 }
    );
  }
}
