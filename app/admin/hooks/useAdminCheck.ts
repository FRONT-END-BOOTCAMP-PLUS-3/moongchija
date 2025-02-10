import { getUserIdClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useAdminCheck = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUserId = await getUserIdClient();
      setUserId(currentUserId);

      try {
        const response = await fetch("/api/admin");

        if (!response.ok) {
          throw new Error("서버 응답 실패");
        }
        const data = await response.json();

        if (data.userInfo.type !== "admin") {
          setErrorMessage(
            "이 페이지는 관리자 전용 페이지입니다. 권한이 없는 사용자로는 접근할 수 없습니다."
          );

          setTimeout(() => {
            router.push("/user/appointments");
          }, 2000);
        }

        if (data?.redirectUrl) {
          setRedirectUrl(data.redirectUrl);
        }
      } catch (error) {
        console.error("❌ useAdminCheck 오류:", error);
        setErrorMessage("관리자 권한 확인 중 오류가 발생했습니다.");
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (redirectUrl) {
      router.push(redirectUrl);
    }
  }, [redirectUrl, router]);

  return { userId, errorMessage };
};

export default useAdminCheck;
