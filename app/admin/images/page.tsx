"use client";

import { useEffect, useState } from "react";
import styles from "./images.module.scss";

interface Image {
  id: number;
  url: string;
  uploaded_at: string;
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/images");
    const data = await res.json();
    setImages(data);
  };

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
    <div className={styles.container}>
      <h2>🖼 이미지 관리</h2>

      {images.length > 0 ? (
        <div className={styles.imageGrid}>
          {images.map((image) => (
            <div key={image.id} className={styles.imageCard}>
              <img src={image.url} alt={`업로드된 이미지 ${image.id}`} />
              <p>{new Date(image.uploaded_at).toLocaleString()}</p>
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
  );
}
