"use client";

import { useUser } from "@/context/UserContext";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();

  useEffect(() => {
    const checkMember = async () => {
      try {
        if (user) {
          const response = await fetch(
            `/api/user/appointments/${id}?userId=${user.id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            alert("❌ 해당 약속의 멤버가 아닙니다.");
            router.push("/user/appointments");
            return;
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    checkMember();
  });
  return children;
}
