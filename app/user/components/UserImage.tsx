import Button from "@/components/button/Button";
import Image from "next/image";
import styles from "./UserImage.module.scss";
const UserImage = () => {
  return (
    <div className={styles.profileBox}>
      <div className={styles.profileImage}>
        <Image
          src={"/images/emojis/cerberus.webp"}
          width={100}
          height={100}
          alt="케르베로스"
        />
      </div>
      <Button text="수정" size="xs" />
    </div>
  );
};

export default UserImage;
