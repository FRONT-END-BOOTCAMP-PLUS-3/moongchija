export const getUserIdClient = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/user-id", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함
    });

    if (!response.ok) throw new Error("유저 정보를 가져올 수 없음");

    const data = await response.json();
    return data.userId;
  } catch (error) {
    console.log("❌ userId 가져오기 실패:", error);
    return null;
  }
};
