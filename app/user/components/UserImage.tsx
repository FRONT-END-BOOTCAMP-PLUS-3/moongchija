import Button from "@/components/button/Button";
import Image from "next/image";
import styles from "./UserImage.module.scss";
import Modal from "@/components/modal/Modal";
import { useState } from "react";
import UserImageModalContent from "./UserImageModalContent";
const UserImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);
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
      <Button text="수정" size="xs" onClick={handleopenModal} />
      <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
        <UserImageModalContent />
      </Modal>
    </div>
  );
};

export default UserImage;
