"use client";

import { useState } from "react";
import CircleButton from "@/components/circleButton/CircleButton";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import GalleryDetail from "../components/gallery/galleryDetail/galleryDetail";
import styles from "./gallery.module.scss";
import Modal from "@/components/modal/Modal";
import Button from "@/components/button/Button";
import Image from "next/image"; 

const GalleryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <DetailTabMenu />
      <div className={styles.container}>
        <GalleryDetail />
      </div>

      <div className={styles.circleButtonWrapper}>
        <CircleButton onClick={openModal} />
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className={styles.modalContainer}>
          <div className={styles.noticeModalBox}>
            <span className={styles.title}>사진 업로드</span>

            <div className={styles.imageWrapper}>
              <Image
                src="/images/sample-image.jpg"
                alt="Uploaded Image"
                width={300}  
                height={300} 
                className={styles.uploadedImage}
              />
            </div>

            <div className={styles.buttonWrapper}>
              <Button
                text="사진 찾기"
                size="sm"
                color="--grey-5-color"
                active={true}
                onClick={closeModal}
              />
              <Button
                text="첨부하기"
                size="sm"
                color="--primary-color"
                active={true}
                onClick={closeModal}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryPage;
