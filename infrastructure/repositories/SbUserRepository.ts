import { User } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { createClient } from "@/utils/supabase/server";

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

  async createUser(
    user_email: string,
    password: string,
    nickname: string,
    emoji: string
  ): Promise<Omit<User, "password"> & { access_token: string }> {
    const supabase = await createClient();

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: user_email,
      password,
      options: {
        data: {
          nickname,
          emoji,
        },
      },
    });

    if (authError) {
      console.log("AuthError :", authError);

      throw authError;
    }

    return {
      id: authData.user!.id,
      user_email: user_email,
      nickname: nickname,
      emoji: emoji,
      created_at: new Date(),
      access_token: authData.session!.access_token,
    };
  }

  async findUserByEmail(
    user_email: string
  ): Promise<Omit<User, "password"> | null> {
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
      emoji: user.emoji,
      created_at: new Date(user.created_at),
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

  async updateUser(
    userId: string,
    updateData: { nickname?: string; emoji?: string }
  ): Promise<User> {
    const supabase = await createClient();

    const { data: existingData, error: findError } = await supabase
      .from("user")
      .select()
      .eq("id", userId)
      .single();

    if (findError || !existingData) {
      console.error("사용자를 찾을 수 없음:", userId, findError);
      throw new Error("업데이트할 사용자를 찾을 수 없습니다.");
    }

    const { data, error } = await supabase
      .from("user")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("사용자 정보 업데이트 중 오류:", error);
      console.log("업데이트 시도한 데이터:", { userId, updateData });
      throw new Error("사용자 정보를 업데이트하는 데 실패했습니다.");
    }

    if (!data) {
      throw new Error("업데이트된 사용자 정보를 찾을 수 없습니다.");
    }

    return {
      id: data.id,
      user_email: data.user_email,
      password: data.password,
      nickname: data.nickname,
      emoji: data.emoji,
      created_at: new Date(data.created_at),
    };
  }
}
