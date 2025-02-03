import { DfAppointmentCardUsecase } from "@/application/usecases/appointment/DfGetAppointmentCardUsecase";
import { SbAppointmentRepository } from "@/infrastructure/repositories/SbAppointmentRepository";
import { SbMemberRepository } from "@/infrastructure/repositories/SbMemberRepository";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextResponse } from "next/server";

// ✅ GET 요청 핸들러
export async function GET() {
// export async function GET(req: NextRequest) {
  try {
    // // ✅ Supabase 클라이언트 생성
    // const supabase = await createClient();
    // if (!supabase) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // // ✅ 현재 로그인된 유저 확인
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();

    // if (!session || !session.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // // ✅ 로그인된 사용자 ID 가져오기
    // const userId = session.user.id;

    // ✅ 레포지토리 및 유스케이스 생성
    const userRepository = new SbUserRepository();
    const memberRepository = new SbMemberRepository();
    const appointmentRepository = new SbAppointmentRepository();

    const usecase = new DfAppointmentCardUsecase(
      userRepository,
      memberRepository,
      appointmentRepository
    );

    // ✅ 유스케이스 실행 -> 사용자 약속 리스트 가져오기
    const appointments = await usecase.execute();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
