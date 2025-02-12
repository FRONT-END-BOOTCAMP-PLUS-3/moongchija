import Image from "next/image";
import styles from "./UserImage.module.scss";
import Modal from "@/components/modal/Modal";
import { useEffect, useState } from "react";
import UserImageModalContent from "./UserImageModalContent";
import { useUser } from "@/context/UserContext";
import { getEmojiAltText } from "@/utils/user/userEmojiAltText";
import EmojiSkeleton from "./user-skeleton/EmojiSkeleton";
import { FaCamera } from "react-icons/fa";

const UserImage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleopenModal = () => setIsModalOpen(true);
  const handlecloseModal = () => setIsModalOpen(false);
  const [altText, setAltText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (user?.emoji) {
      const result = getEmojiAltText(user.emoji);
      setAltText(result);
      setIsLoading(false);
    }
  }, [user?.emoji]);

  return (
    <div className={styles.profileBox}>
      <div className={styles.profileImage}>
        {isLoading ? (
          <EmojiSkeleton />
        ) : (
          user?.emoji && (
            <Image src={user?.emoji} width={100} height={100} alt={altText} />
          )
        )}
        <button onClick={handleopenModal} className={styles.editButton}>
          <FaCamera className={styles.cameraIcon} />
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handlecloseModal}>
        <UserImageModalContent onClose={handlecloseModal} />
      </Modal>
    </div>
  );
};

export default UserImage;
