import { DfUpdateNicknameUsecase } from "./../../../../application/usecases/user/DfUpdateNicknameUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest) => {
  try {
    const { nickname } = await request.json();

    if (!nickname) {
      return NextResponse.json(
        { message: "닉네임이 없습니다." },
        { status: 400 }
      );
    }

    const userId = (await cookies()).get("userId")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    const userRepository = new SbUserRepository();
    const updateNicknameUscase = new DfUpdateNicknameUsecase(userRepository);
    const userInfo = await updateNicknameUscase.execute(userId, { nickname });

    return NextResponse.json(userInfo);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "이미 사용 중인 닉네임입니다.") {
        return NextResponse.json({ message: error.message }, { status: 409 });
      }
      return NextResponse.json(
        {
          message: error.message || "서버 오류가 발생했습니다.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
};
