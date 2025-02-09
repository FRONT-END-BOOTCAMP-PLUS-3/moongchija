import { NextResponse, NextRequest } from "next/server";
import { SbPaymentsRepository } from "@/infrastructure/repositories/SbPaymentsRepository";
import { SbPaymentsDetailRepository } from "@/infrastructure/repositories/SbPaymentsDetailRepository";
import { DfGetSettlementUsecase } from "@/application/usecases/appointment/DfGetSettlementUsecase";
import { DfCreateSettlementUsecase } from "@/application/usecases/appointment/DfCreateSettlementUsecase";
import { DfUpdateSettlementUsecase } from "@/application/usecases/appointment/DfUpdateSettlementUsecase";

// 정산 정보 조회 (GET)
export async function GET(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const appointmentId = Number(urlParts[urlParts.length - 2]); // '/api/user/appointments/[id]/settlement'에서 [id] 추출

    if (!appointmentId || isNaN(appointmentId)) {
      return NextResponse.json(
        { error: "Invalid appointment ID" },
        { status: 400 }
      );
    }

    const paymentsRepository = new SbPaymentsRepository();
    const paymentsDetailRepository = new SbPaymentsDetailRepository();

    const usecase = new DfGetSettlementUsecase(
      paymentsRepository,
      paymentsDetailRepository
    );

    const settlementInfo = await usecase.execute(appointmentId);


    return NextResponse.json(settlementInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// 정산 정보 및 세부 내역 생성 (POST)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      appointmentId,
      accountNumber,
      accountHolderName,
      bank,
      memberCount,
      details, // [{ amount: number, descript: string }, ...]
    } = body;

    const parsedAppointmentId = Number(appointmentId);
    const parsedMemberCount = Number(memberCount);

    if (
      !accountNumber ||
      !accountHolderName ||
      !bank ||
      isNaN(parsedAppointmentId) ||
      isNaN(parsedMemberCount)
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (!Array.isArray(details)) {
      return NextResponse.json(
        { error: "세부 내역은 배열 형태여야 합니다." },
        { status: 400 }
      );
    }

    const paymentsRepository = new SbPaymentsRepository();
    const paymentsDetailRepository = new SbPaymentsDetailRepository();

    const usecase = new DfCreateSettlementUsecase(
      paymentsRepository,
      paymentsDetailRepository
    );

    await usecase.execute(
      parsedAppointmentId,
      accountNumber,
      accountHolderName,
      bank,
      parsedMemberCount,
      details
    );

    return NextResponse.json(
      { message: "Settlement created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create settlement" },
      { status: 500 }
    );
  }
}

// 정산 정보 및 세부 내역 수정 (PUT)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      appointmentId,
      accountNumber,
      accountHolderName,
      bank,
      memberCount,
      details, // [{ amount: number, descript: string }, ...]
    } = body;

    const parsedAppointmentId = Number(appointmentId);
    const parsedMemberCount = Number(memberCount);

    if (
      !accountNumber ||
      !accountHolderName ||
      !bank ||
      isNaN(parsedAppointmentId) ||
      isNaN(parsedMemberCount)
    ) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    if (!Array.isArray(details)) {
      return NextResponse.json(
        { error: "세부 내역은 배열 형태여야 합니다." },
        { status: 400 }
      );
    }

    const paymentsRepository = new SbPaymentsRepository();
    const paymentsDetailRepository = new SbPaymentsDetailRepository();

    const usecase = new DfUpdateSettlementUsecase(
      paymentsRepository,
      paymentsDetailRepository
    );

    await usecase.execute(
      parsedAppointmentId,
      accountNumber,
      accountHolderName,
      bank,
      parsedMemberCount,
      details
    );

    return NextResponse.json(
      { message: "Settlement updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update settlement" },
      { status: 500 }
    );
  }
}
