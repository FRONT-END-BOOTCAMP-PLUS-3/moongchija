"use client";
import Image from "next/image";
import styles from "./UserImageModalContent.module.scss";
import Button from "@/components/button/Button";

const emojis = [
  { id: 1, src: "/images/emojis/bear.webp", alt: "곰" },
  { id: 2, src: "/images/emojis/cerberus.webp", alt: "케르베로스" },
  { id: 3, src: "/images/emojis/dragon.webp", alt: "용" },
  { id: 4, src: "/images/emojis/ikaros.webp", alt: "이카로스" },
  { id: 5, src: "/images/emojis/lion.webp", alt: "사자" },
  { id: 6, src: "/images/emojis/pegasus.webp", alt: "페가수스" },
  { id: 7, src: "/images/emojis/person.webp", alt: "사람" },
  { id: 8, src: "/images/emojis/werewolf.webp", alt: "늑대인간" },
  { id: 9, src: "/images/emojis/wolf.webp", alt: "늑대" },
];
const UserProfileImageModalContent = () => {
  return (
    <div className={styles.userImageModalContainer}>
      <div className={styles.userEmojiWrapper}>
        {emojis.map((image) => (
          <div key={image.id} className={styles.imageWrapper}>
            <button className={styles.hiddenButton}>
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
      <Button text="변경하기" size="sm" />
    </div>
  );
};

export default UserProfileImageModalContent;
