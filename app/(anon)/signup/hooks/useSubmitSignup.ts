import { useRouter } from "next/navigation";
import { useState } from "react";

const useSubmitSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const submitSignup = async (
    email: string,
    password: string,
    nickname: string
  ) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          password: password,
          nickname: nickname,
        }),
      });
      if (response.ok) {
        const { redirectUrl } = await response.json();
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "회원가입 중 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { submitSignup, isLoading, submitError };
};

export default useSubmitSignup;
