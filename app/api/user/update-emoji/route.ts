import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { DfUpdateEmojiUsecase } from "@/application/usecases/user/DfUpdateEmojiUsecase";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (request: NextRequest) => {
  try {
    const { emoji } = await request.json();

    if (!emoji) {
      throw new Error("이모지가 없습니다.");
    }

    const userId = (await cookies()).get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRepository = new SbUserRepository();
    const updateEmojiUsecase = new DfUpdateEmojiUsecase(userRepository);
    const userInfo = await updateEmojiUsecase.execute(userId, { emoji });

    return NextResponse.json(userInfo);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("유저 정보 업데이트 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};
