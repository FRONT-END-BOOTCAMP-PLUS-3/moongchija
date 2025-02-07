"use client";

import Image from "next/image";
import styles from "./GalleryDetail.module.scss";
import Modal from "@/components/modal/Modal";
import { FC, useState } from "react";
import Button from "@/components/button/Button";
import { ImageListDto } from "@/application/usecases/appointmentImage/dto/ImageListDto";



interface GalleryDetailProps {
  galleryData: ImageListDto[];
}

const GalleryDetail: FC<GalleryDetailProps> = ({ galleryData }) => {
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
                src={photo.image_url}
                alt={`Photo by ${photo.creater_id}`}
                width={150}
                height={150}
                className={styles.image}
                onClick={openModal}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.modal}>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modalContainer}>
            <div className={styles.modalBox}>
              <div className={styles.photo}>
                {/* 모달 내에서 첫 번째 이미지를 예시로 보여줍니다. 필요에 따라 선택된 이미지를 보여주도록 수정하세요. */}
                <Image
                  src={galleryData[0]?.image_url || ""}
                  alt={`Photo by ${galleryData[0]?.creater_id}`}
                  width={360}
                  height={360}
                  className={styles.image}
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
