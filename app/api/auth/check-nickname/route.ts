import { DfUserNicknameCheckUsecase } from "@/application/usecases/auth/DfUserNicknameCheckUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { nickname } = await request.json();

    if (!nickname) {
      return NextResponse.json(
        { error: "닉네임을 입력해주세요." },
        { status: 400 }
      );
    }

    const userRepository = new SbUserRepository();
    const userNicknameCheckUsecase = new DfUserNicknameCheckUsecase(
      userRepository
    );

    const result = await userNicknameCheckUsecase.excute(nickname);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking nickname:", error);
    return NextResponse.json(
      { error: "닉네임 중복 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
};
