import { getUserIdClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
const useAdminCheck = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUserId = await getUserIdClient();
      setUserId(currentUserId);
      if (currentUserId !== ADMIN_USER_ID) {
        setErrorMessage(
          "이 페이지는 관리자 전용입니다. 권한이 없는 사용자로는 접근할 수 없습니다."
        );
        setTimeout(() => {
          router.push("/user/appointments");
        }, 2000);
      }
    };

    checkUser();
  }, [router]);

  return { userId, errorMessage };
};

export default useAdminCheck;
