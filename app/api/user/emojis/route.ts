import { DfAllEmojisUsecase } from "@/application/usecases/user/DfAllEmojisUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const userRepository = new SbUserRepository();
  const allEmojis = new DfAllEmojisUsecase(userRepository);

  const getAllEmojis = await allEmojis.execute();

  return NextResponse.json(getAllEmojis);
};
