import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const supabase = createClientComponentClient();

export const getUserIdClient = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error || !session || !session.user) {
      console.warn("❌ 유저 세션 없음, 로그인이 필요합니다.");
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("❌ 유저 정보 가져오기 실패:", error);
    return null;
  }
};
