"use client";

import { useState, useEffect, useRef } from "react";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import GalleryDetail from "../components/gallery/GalleryDetail/GalleryDetail";
import styles from "./gallery.module.scss";
import { useParams } from "next/navigation";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import CircleButton from "@/components/circleButton/CircleButton";
import Modal from "@/components/modal/Modal";
import Button from "@/components/button/Button";
import Image from "next/image";
import { MdClose } from "react-icons/md";

export interface ImagesDto {
  id: number;
  appointment_id: number;
  image_url: string;
  creater_id: string;
  created_at: Date;
  nickname: string;
}

const GalleryPage = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState<ImagesDto[]>([]); // 약속 이미지 데이터 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openUploaderModal = () => setIsModalOpen(true);
  const closeUploaderModal = () => setIsModalOpen(false);
  const onSuccessUpload = () => (setIsModalOpen(false), alert("완료"));

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

  const fetchGallery = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`/api/user/appointments/${id}/gallery`);
      if (!response.ok) throw new Error("이미지 불러오기 실패");
      const data = await response.json();
      setGalleryData(data);
    } catch (error) {
      console.error(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <IconHeader />
        <DetailTabMenu />
        <div className={styles.container}>
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <IconHeader />
        <DetailTabMenu />
        <div className={styles.container}>
          <p className={styles.errorMessage}>
            이미지 데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        <GalleryDetail
          galleryData={galleryData}
          setGalleryData={setGalleryData}
        />
      </div>

      <CircleButton onClick={openUploaderModal} />

      <Modal isOpen={isModalOpen} onClose={closeUploaderModal}>
        <div className={styles.uploaderModalContainer}>
          <div className={styles.uploaderModalBox}>
            <span className={styles.title}>사진 업로드</span>

            <div className={styles.uploaderImageWrapper}>
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
                    className={styles.uploaderDeleteButton}
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
                onClick={onSuccessUpload}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryPage;
