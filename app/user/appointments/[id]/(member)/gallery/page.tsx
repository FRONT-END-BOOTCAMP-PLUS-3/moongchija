"use client";

import Button from "@/components/button/Button";
import CircleButton from "@/components/circleButton/CircleButton";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import Modal from "@/components/modal/Modal";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import GalleryDetail from "../components/gallery/galleryDetail/GalleryDetail";
import styles from "./gallery.module.scss";

export interface ImagesDto {
  id: number;
  appointment_id: number;
  image_url: string;
  creater_id: string;
  created_at: Date;
  nickname: string;
}

const GalleryPage = () => {
  const params = useParams();
  const id = params.id as string;
  const [galleryData, setGalleryData] = useState<ImagesDto[]>([]); // 약속 이미지 데이터 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {user} =useUser();

  const openUploaderModal = () => setIsModalOpen(true);
  const closeUploaderModal = () => setIsModalOpen(false);

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

  const handleUploadImage = async () => {
    if (!fileInputRef.current?.files?.length) {
      alert("파일을 선택하세요.");
      return;
    }

    const file = fileInputRef.current.files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("appointment_id", id);
    formData.append("creater_id", String(user?.id)); 

    try {
      const response = await fetch(`/api/user/appointments/${id}/gallery`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const postImage = await response.json();

      setIsModalOpen(false);
      alert("이미지 업로드가 완료되었습니다.");
      const uploadedImg = {
        ...postImage,
        nickname: user?.nickname,
      };
      setGalleryData((prev) => [...prev, uploadedImg]); 
      setUploadedImage(null);
      setIsModalOpen(false);  
    } catch (error) {
      console.error(error);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleFindPhotoClick = () => {
    fileInputRef.current?.click();
  };

  // 사진 업로드 모달창에서 사진 비울때
  const handleDeleteImage = () => {
    const confirmDelete = window.confirm("이미지를 삭제하시겠습니까?");
    if (confirmDelete) {
      setUploadedImage(null);
    }
  };

  const fetchGallery = useCallback(async () => {
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
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id, fetchGallery]);



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
        {galleryData.length === 0 ? (
          <p className={styles.noGallery}>등록된 사진이 없습니다</p>
        ) : (
          <GalleryDetail
            galleryData={galleryData}
            setGalleryData={setGalleryData}
          />
        )}
      </div>

      <CircleButton onClick={openUploaderModal} />

      {/* 사진 업로드 모달창 */}
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
                onClick={handleUploadImage}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GalleryPage;
