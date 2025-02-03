"use client";

import { useState, useRef, useEffect } from "react";
import CircleButton from "@/components/circleButton/CircleButton";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import styles from "./gallery.module.scss";
import Modal from "@/components/modal/Modal";
import Button from "@/components/button/Button";
import Image from "next/image";
import { MdClose } from "react-icons/md";
import GalleryDetail from "../components/gallery/GalleryDetail/GalleryDetail";
import detailDummyData from "../components/detail/dummyData/detailDummyData";
import { useParams } from "next/navigation";
import { detailTypes } from "../components/detail/types/detailTypes";
import IconHeader from "@/components/header/IconHeader";

const GalleryPage = () => {
  const { id } = useParams(); 
  const [detail, setDetail] = useState<detailTypes | null>(null);
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

  useEffect(() => {
    if (id) {
      const appointmentDetail = detailDummyData.find((data) => data.id === Number(id));
      setDetail(appointmentDetail || null);
    }
  }, [id]);

  if (!detail) return <div>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
       <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        <GalleryDetail galleryData={detail.gallery}  />
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
