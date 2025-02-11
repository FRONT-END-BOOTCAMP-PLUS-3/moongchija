import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { generateJwtToken } from "@/utils/auth/auth-utils";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export class SbUserRepository implements UserRepository {
  private async getClient(): Promise<SupabaseClient> {
    return await createClient();
  }
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
    type: string,
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
          type,
        },
      ])
      .select();

    if (error) {
      throw new Error("회원가입 실패: " + error.message);
    }

    const userId = data[0].id;

    const access_token = generateJwtToken(userId, user_email, nickname, emoji);

    return {
      id: userId,
      user_email: user_email,
      nickname: nickname,
      emoji: emoji,
      created_at: new Date(),
      access_token,
      provider,
      type,
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

  // ✅ 여러 `user_id`를 기반으로 `nickname` 조회
  async getNicknamesByUserIds(
    userIds: string[]
  ): Promise<{ user_id: string; nickname: string }[]> {
    if (userIds.length === 0) return [];

    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("user")
      .select("id, nickname")
      .in("id", userIds);

    if (error) {
      throw new Error(`유저 닉네임 조회 실패: ${error.message}`);
    }

    return data
      ? data.map((user) => ({ user_id: user.id, nickname: user.nickname }))
      : [];
  }

  async createUserRandomEmoji(): Promise<string> {
    const supabase = await createClient();

    const { data, error } = await supabase.storage
      .from("images")
      .list("emojis/", { limit: 100 });

    if (error) {
      console.error("Error fetching emoji list:", error.message);
      throw new Error("이모지 목록을 가져오는 데 실패했습니다.");
    }

    if (!data || data.length === 0) {
      throw new Error("이모지 목록이 비어 있습니다.");
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    const selectedEmojiFile = data[randomIndex];

    const { data: emojiUrl } = await supabase.storage
      .from("images")
      .getPublicUrl(`emojis/${selectedEmojiFile.name}`);

    if (emojiUrl) {
      return emojiUrl.publicUrl;
    } else {
      throw new Error("이모지 URL이 존재하지 않습니다.");
    }
  }

  async findAllEmojis(): Promise<{ id: number; src: string; alt: string }[]> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("images")
      .list("emojis/", { limit: 100 });

    if (error) {
      console.error("Error fetching emoji list:", error.message);
      throw new Error("이모지 목록을 가져오는 데 실패했습니다.");
    }

    if (!data || data.length === 0) {
      throw new Error("이모지 목록이 비어 있습니다.");
    }
    const emojis = data.map((emoji, index) => {
      const publickUrl = supabase.storage
        .from("images")
        .getPublicUrl(`emojis/${emoji.name}`).data; // publicURL을 올바르게 추출
      return {
        id: index + 1, // id는 단순히 인덱스로 할당 (수정 가능)
        src: publickUrl.publicUrl, // publicURL을 src로 설정
        alt: emoji.name.split(".")[0], // 파일 이름에서 확장자를 제외하고 alt 텍스트 설정
      };
    });

    return emojis;
  }

  async updateUserInfo(
    userId: string,
    updateData: { nickname?: string; emoji?: string }
  ): Promise<User> {
    const supabase = await createClient();

    try {
      const { data: existingUser, error: findError } = await supabase
        .from("user")
        .select("id, nickname, emoji")
        .eq("id", userId)
        .single();

      if (findError || !existingUser) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      if (updateData.nickname) {
        const nicknameDuplicateCheck = await this.findUserByNickname(
          updateData.nickname
        );
        if (nicknameDuplicateCheck) {
          throw new Error("이미 사용 중인 닉네임입니다.");
        }
      }

      const updateFields: { nickname?: string; emoji?: string } = {};
      if (updateData.nickname) updateFields.nickname = updateData.nickname;
      if (updateData.emoji) updateFields.emoji = updateData.emoji;

      if (Object.keys(updateFields).length === 0) {
        throw new Error("변경할 정보가 없습니다.");
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from("user")
        .update(updateFields)
        .eq("id", userId)
        .select()
        .single();

      if (updateError) {
        console.error("🔥 Supabase 업데이트 오류 :", updateError);
        throw new Error("유저 정보 업데이트에 실패했습니다.");
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          error.message || "유저 정보 업데이트 중 오류가 발생했습니다."
        );
      } else {
        throw new Error(
          "유저 정보 업데이트 중 알 수 없는 오류가 발생했습니다."
        );
      }
    }
  }

  // ✅ 전체 유저 조회
  async getAllUsers(): Promise<User[]> {
    const supabase = await this.getClient();

    const { data, error } = await supabase
      .from("user")
      .select("id, user_email, nickname, created_at"); // ✅ 필요한 필드만 선택

    if (error) {
      throw new Error("유저 목록 조회 실패");
    }

    // ✅ `User` 타입에 맞게 변환 (부족한 필드는 기본값 제공)
    return (data || []).map((user) => ({
      id: user.id,
      user_email: user.user_email,
      nickname: user.nickname,
      created_at: new Date(user.created_at),
      password: "", // ✅ 기본값 설정
      emoji: "", // ✅ 기본값 설정
      provider: "", // ✅ 기본값 설정
    }));
  }

  // ✅ 특정 유저 삭제
  async deleteUser(userId: string): Promise<boolean> {
    const supabase = await this.getClient();

    const { error } = await supabase.from("user").delete().eq("id", userId);

    if (error) {
      console.error("❌ 유저 삭제 실패:", error);
      return false;
    }

    return true;
  }

  async isUserInAdmin(userId: string): Promise<boolean> {
    const client = await this.getClient();

    const { data, error } = await client
      .from("user")
      .select("type")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Failed to check admin: ${error.message}`);
    }

    return data?.type === "admin"; // ✅ 올바르게 `type` 값을 비교
  }
}
