"use client";

import Image from "next/image";
import styles from "./GalleryDetail.module.scss";
import Modal from "@/components/modal/Modal";
import { FC, useState } from "react";
import Button from "@/components/button/Button";
import { GalleryItem } from "../../detail/types/detailTypes";

interface GalleryDetailProps {
  galleryData: GalleryItem[];
}

const GalleryDetail: FC<GalleryDetailProps> = ({galleryData}) => {
  const photos = [
    { id: 1, src: "/images/고뭉치.png", username: "User1" },
    { id: 2, src: "/images/고뭉치.png", username: "User2" },
    { id: 3, src: "/images/고뭉치.png", username: "User3" },
    { id: 4, src: "/images/고뭉치.png", username: "User4" },
    { id: 5, src: "/images/고뭉치.png", username: "User5" },
    { id: 6, src: "/images/고뭉치.png", username: "User6" },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = () => {
    const confirmation = confirm("삭제하겠습니까?");
    if (confirmation) {
      alert("삭제되었습니다");
    }
    closeModal();
  };

  return (
    <div>
      <div className={styles.galleryContainer}>
        {galleryData.map((photo) => (
          <div key={photo.id} className={styles.photoCard}>
            <div className={styles.photos}>
              <Image
                src={photo.src}
                alt={`Photo by ${photo.user}`}
                width={190}
                height={190}
                className={styles.image}
                onClick={openModal}
              />
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userIcon}></div>
              <span className={styles.username}>{photo.user}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.modal}>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modalContainer}>
            <div className={styles.modalBox}>
              <div className={styles.photo}>
                <Image
                  src={photos[0].src}
                  alt={`Photo by ${photos[0].username}`}
                  width={360}
                  height={360}
                  className={styles.image}
                  onClick={openModal}
                />
              </div>
              <div className={styles.deleteButton}>
                <Button
                  text="삭제하기"
                  size="sm"
                  color="--exit-red"
                  active={true}
                  onClick={handleDelete}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GalleryDetail;
