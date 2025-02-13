"use client";

import { getUserIdClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
type User = {
  id: string;
  user_email: string;
  nickname: string;
  emoji: string;
  created_at: string;
  provider: string;
} | null;

// context 생성
const UserContext = createContext<{
  user: User;
  setUser: (user: User) => void;
}>({
  user: null,
  setUser: () => {},
});

// provider 생성
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getUserIdClient();
        if (!user) {
          alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          localStorage.setItem("redirectPath", window.location.pathname);
          router.push("/login");
          return;
        }
        setUserId(user);
      } catch (error) {
        console.log("❌ 유저 정보 가져오기 실패:", error);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const getUserData = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/user/${userId}`);
        if (!response.ok) {
          console.log("Failed to fetch appointments");
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.log(error);
      }
    };

    getUserData();
  }, [userId]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
