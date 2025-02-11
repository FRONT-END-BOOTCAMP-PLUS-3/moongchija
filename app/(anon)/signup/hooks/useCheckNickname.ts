import { useState } from "react";

const useCheckNickname = () => {
  const [nicknameCheckError, setNicknameCheckError] = useState<string | null>(
    null
  );
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [nicknameCheckSuccess, setNicknameCheckSuccess] = useState<
    string | null
  >(null);

  const resetNicknameCheckState = () => {
    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);
    setIsNicknameAvailable(false);
  };

  const handleCheckNickname = async (nickname: string) => {
    if (!nickname) {
      setNicknameCheckError(null);
      setNicknameCheckSuccess(null);

      return;
    }

    setNicknameCheckError(null);
    setNicknameCheckSuccess(null);

    try {
      const response = await fetch("/api/auth/check-nickname", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await response.json();

      if (data.isAvailable) {
        setIsNicknameAvailable(true);
        setNicknameCheckSuccess("사용 가능한 닉네임입니다.");
      } else {
        setNicknameCheckError("이미 사용중인 닉네임입니다.");
        setIsNicknameAvailable(false);
      }
    } catch (error) {
      setNicknameCheckSuccess(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );

      setIsNicknameAvailable(false);
    }
  };

  return {
    isNicknameAvailable,
    nicknameCheckError,
    nicknameCheckSuccess,
    handleCheckNickname,
    resetNicknameCheckState,
  };
};

export default useCheckNickname;
