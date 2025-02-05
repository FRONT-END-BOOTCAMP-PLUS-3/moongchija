"use client";
import Image from "next/image";
import styles from "./UserImageModalContent.module.scss";
import Button from "@/components/button/Button";
import { useEffect, useState } from "react";

type Emoji = {
  id: number;
  src: string;
  alt: string;
};

const UserProfileImageModalContent = () => {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);

  const getEmojis = async () => {
    try {
      const response = await fetch("/api/user/emojis");

      if (!response.ok) {
        throw new Error("Failed to fetch emojis");
      }

      const emojis = await response.json();
      setEmojis(emojis);
    } catch (error) {}
  };

  useEffect(() => {
    getEmojis();
  }, []);

  const handleEmojiChange = async () => {
    if (!selectedEmoji) {
      alert("이모지를 선택해주세요.");
      return;
    }

    const confirmChange = confirm("이모지를 변경하시겠습니까?");
    if (!confirmChange) {
      return;
    }

    try {
      const response = await fetch("/api/user/update-emoji", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emoji: selectedEmoji }),
      });

      if (!response.ok) {
        throw new Error("이모지 업데이트에 실패하였습니다.");
      }

      alert("이모지가 성공적으로 변경되었습니다!");
    } catch (error) {
      console.error("Error updating emoji:", error);
      alert("이모지 변경 중 오류가 발생했습니다.");
    }
  };

  const handleEmojiClick = (image: Emoji) => {
    setSelectedEmoji(image.src);
  };

  return (
    <div className={styles.userImageModalContainer}>
      <div className={styles.userEmojiWrapper}>
        {emojis.map((image) => (
          <div
            key={image.id}
            className={`${styles.imageWrapper} ${
              selectedEmoji === image.src ? styles.selected : ""
            }`}
          >
            <button
              className={styles.hiddenButton}
              onClick={() => handleEmojiClick(image)}
            >
              <Image
                src={image.src}
                alt={image.src}
                width={50}
                height={50}
                className={styles.emojiImage}
              />
            </button>
          </div>
        ))}
      </div>
      <Button text="변경하기" size="sm" onClick={handleEmojiChange} />
    </div>
  );
};

export default UserProfileImageModalContent;
