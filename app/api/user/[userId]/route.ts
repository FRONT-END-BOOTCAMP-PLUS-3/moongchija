import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "유효한 사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const userRepository = new SbUserRepository();
    const userData = await userRepository.findById(userId);

    if (!userData) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("❌ 사용자 정보 조회 실패:", error);
    return NextResponse.json({ error: "서버 내부 오류" }, { status: 500 });
  }
};
