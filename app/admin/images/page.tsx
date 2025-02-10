"use client";

import { useEffect, useState } from "react";
import styles from "./images.module.scss";
import { useRouter } from "next/navigation";
import { getUserIdClient } from "@/utils/supabase/client";
import Image from "next/image";

interface Image {
  id: number;
  appointment_id: number;
  image_url: string;
  creater_id: string;
  created_at: string;
}
const ADMIN_USER_ID = process.env.NEXT_PUBLIC_ADMIN_USER_ID;
export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(data);
  };
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

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      setImages(images.filter((image) => image.id !== id));
    } else {
      alert("삭제 실패");
    }
  };

  return (
    <>
      {errorMessage ? (
        <div className={styles.errorMessage}>{errorMessage}</div>
      ) : (
        <div className={styles.container}>
          <h2>🖼 이미지 관리</h2>

          {images.length > 0 ? (
            <div className={styles.imageGrid}>
              {images.map((image) => (
                <div key={image.id} className={styles.imageCard}>
                  <a href={image.image_url} target="_blank">
                    <img
                      width={100}
                      height={150}
                      src={image.image_url}
                      alt={`이미지 ${image.id}`}
                    />
                  </a>
                  <p>업로드한 유저: {image.creater_id}</p>
                  <p>{new Date(image.created_at).toLocaleString()}</p>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(image.id)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noImages}>등록된 이미지가 없습니다.</p>
          )}
        </div>
      )}
    </>
  );
}
