import { SbAuthRepository } from "@/infrastructure/repositories/SbAuthRepository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authRepository = new SbAuthRepository();
    const loginUrl = await authRepository.getKakaoLoginUrl();

    return NextResponse.json({ loginUrl });
  } catch (error) {
    console.error("Kakao 로그인 URL 생성 중 오류 발생:", error);

    return NextResponse.json(
      { error: "Kakao 로그인 URL을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
