import { NextResponse, NextRequest } from "next/server";
import { SbPaymentsRepository } from "@/infrastructure/repositories/SbPaymentsRepository";
import { SbPaymentsDetailRepository } from "@/infrastructure/repositories/SbPaymentsDetailRepository";
import { DfGetSettlementUsecase } from "@/application/usecases/appointment/DfGetSettlementUsecase";

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

    if (!settlementInfo) {
      return NextResponse.json(
        { error: "Settlement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(settlementInfo);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
