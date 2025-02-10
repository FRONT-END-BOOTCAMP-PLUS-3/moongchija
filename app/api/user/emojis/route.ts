import { DfGetAllEmojisUsecase } from "@/application/usecases/user/DfGetAllEmojisUsecase";
import { SbUserRepository } from "@/infrastructure/repositories/SbUserRepository";
import { NextResponse } from "next/server";

export const GET = async () => {
  const userRepository = new SbUserRepository();
  const allEmojis = new DfGetAllEmojisUsecase(userRepository);

  const getAllEmojis = await allEmojis.execute();

  return NextResponse.json(getAllEmojis);
};
