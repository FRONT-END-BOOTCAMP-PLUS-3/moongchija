"use client";

import { useState, useRef } from "react";
import CircleButton from "@/components/circleButton/CircleButton";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import styles from "./gallery.module.scss";
import Modal from "@/components/modal/Modal";
import Button from "@/components/button/Button";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import GalleryDetail from "../components/gallery/GalleryDetail/GalleryDetail";

const GalleryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setUploadedImage(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFindPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    const confirmDelete = window.confirm("이미지를 삭제하시겠습니까?");
    if (confirmDelete) {
      setUploadedImage(null);
    }
  };

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
              {uploadedImage ? (
                <div className={styles.imageContainer}>
                  <Image
                    src={uploadedImage}
                    alt="Uploaded Preview"
                    width={360}
                    height={360}
                    className={styles.uploadedImage}
                  />
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={handleDeleteImage}
                  >
                    <MdClose size={25} color="white" />
                  </button>
                </div>
              ) : (
                <p className={styles.placeholderText}>이미지를 업로드하세요</p>
              )}
            </div>

            <div className={styles.buttonWrapper}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                text="사진 찾기"
                size="sm"
                color="--grey-5-color"
                active={true}
                onClick={handleFindPhotoClick}
              />
              <Button
                text="완료"
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
