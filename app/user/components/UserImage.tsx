import Button from "@/components/button/Button";
import Image from "next/image";
import styles from "./UserImage.module.scss";
import Modal from "@/components/modal/Modal";
import { useEffect, useState } from "react";
import UserImageModalContent from "./UserImageModalContent";
import { useUser } from "@/context/UserContext";
import { getEmojiAltText } from "@/utils/user/userEmojiAltText";
const UserImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);
  const [altText, setAltText] = useState<string>("");

  const { user } = useUser();

  useEffect(() => {
    if (user?.emoji) {
      const result = getEmojiAltText(user.emoji);
      setAltText(result);
    }
  }, [user?.emoji]);

  return (
    <div className={styles.profileBox}>
      <div className={styles.profileImage}>
        {user?.emoji ? (
          <Image src={user?.emoji} width={100} height={100} alt={altText} />
        ) : null}
      </div>
      <Button text="수정" size="xs" onClick={handleopenModal} />
      <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
        <UserImageModalContent />
      </Modal>
    </div>
  );
};

export default UserImage;
