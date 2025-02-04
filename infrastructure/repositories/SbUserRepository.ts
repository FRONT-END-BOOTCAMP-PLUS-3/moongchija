import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { createClient } from "@/utils/supabase/server";
import jwt from "jsonwebtoken";

export class SbUserRepository implements UserRepository {
  async findByIds(id: string[]): Promise<User[]> {
    const supabase = await createClient();
    const { data: users, error } = await supabase
      .from("user")
      .select()
      .in("id", id);

    if (error || !users) {
      throw new Error("Users not found");
    }

    return users;
  }

  async findById(id: string): Promise<User> {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("user")
      .select()
      .eq("id", id)
      .single();

    if (error || !user) {
      throw new Error("User not found");
    }

    return user;
  }

  async findByKakaoId(
    kakao_id: number
  ): Promise<Omit<User, "password" | "created_at"> | null> {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("user")
      .select()
      .eq("kakao_id", kakao_id.toString())
      .maybeSingle();

    if (error) {
      console.error("🚨 Supabase 에러:", error);
      throw new Error("Database error");
    }

    return user
      ? {
          id: user.id,
          user_email: user.user_email,
          nickname: user.nickname,
          emoji: user.emoji,
          provider: user.provider,
          kakao_id: user.kakao_id,
        }
      : null;
  }

  async createUser(
    user_email: string,
    nickname: string,
    emoji: string,
    provider: string,
    kakao_id?: number,
    hashedPassword?: string
  ): Promise<User & { access_token: string }> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("user")
      .insert([
        {
          user_email,
          password: hashedPassword ? hashedPassword : null,
          nickname,
          emoji,
          kakao_id,
          provider,
        },
      ])
      .select();

    if (error) {
      throw new Error("회원가입 실패: " + error.message);
    }

    const userId = data[0].id;

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY 환경 변수가 설정되지 않았습니다.");
    }
    const secretKey = process.env.JWT_SECRET_KEY; // 환경 변수로 비밀 키 설정
    const expiresIn = "1h"; // 토큰 만료 시간 설정 (1시간)

    const payload = {
      userId,
      email: user_email,
      nickname,
      emoji,
    };

    const access_token = jwt.sign(payload, secretKey, { expiresIn });

    return {
      id: userId,
      user_email: user_email,
      nickname: nickname,
      emoji: emoji,
      created_at: new Date(),
      access_token,
      provider,
      kakao_id,
      password: hashedPassword ?? "",
    };
  }

  async findUserByEmail(user_email: string): Promise<User | null> {
    const supabase = await createClient();
    const { data: user, error } = await supabase
      .from("user")
      .select()
      .eq("user_email", user_email)
      .single();

    if (error) return null;
    if (!user) return null;

    return {
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      password: user.password,
      emoji: user.emoji,
      created_at: new Date(user.created_at),
      provider: user.provider,
    };
  }

  async findUserByNickname(nickname: string): Promise<boolean> {
    const supabase = await createClient();
    const { data: user } = await supabase
      .from("user")
      .select("id")
      .eq("nickname", nickname)
      .single();

    return !!user;
  }

  async generateUniqueNickname(baseNickname: string): Promise<string> {
    let newNickname = baseNickname;
    let isUnique = await this.findUserByNickname(newNickname);

    let counter = 1;

    while (isUnique) {
      newNickname = `${baseNickname}${counter}`;
      isUnique = await this.findUserByNickname(newNickname);
      counter++;
    }

    return newNickname;
  }
}
