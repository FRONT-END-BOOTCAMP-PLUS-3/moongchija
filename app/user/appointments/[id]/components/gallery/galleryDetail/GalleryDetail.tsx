"use client";

import Image from "next/image";
import styles from "./GalleryDetail.module.scss";
import Modal from "@/components/modal/Modal";
import { FC, useEffect, useState } from "react";
import Button from "@/components/button/Button";
import { Dispatch, SetStateAction } from "react";
import { getUserIdClient } from "@/utils/supabase/client"

export interface ImagesDto {
  id: number;
  appointment_id: number;
  image_url: string;
  creater_id: string;
  created_at: Date;
  nickname: string;
}

interface GalleryDetailProps {
  galleryData: ImagesDto[];
  setGalleryData: Dispatch<SetStateAction<ImagesDto[]>>;
}

const GalleryDetail: FC<GalleryDetailProps> = ({
  galleryData,
  setGalleryData,
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImg, setSelectedImg] = useState<{ index: number; id: number }>(
    { index: 0, id: 0 }
  );
  const [userId, setUserId] = useState<string | null>(null); 

  const handleImageClick = (index: number, photoId: number) => {
    setIsModalOpen(true);
    setSelectedImg({ index, id: photoId });
  };
  const closeModal = () => setIsModalOpen(false);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    const res = await fetch(`/api/admin/images/${id}`, { method: "DELETE" });
    if (res.ok) {
      setGalleryData(galleryData.filter((image) => image.id !== id));
      setIsModalOpen(false);
    } else {
      alert("삭제 실패");
    }
  };


    useEffect(() => {
      const fetchUserId = async () => {
        const fetchedUserId = await getUserIdClient();
        setUserId(fetchedUserId); 
      };
      fetchUserId();
    }, []);
  

  return (
    <div>
      <div className={styles.galleryContainer}>
        {galleryData.map((photo, index) => (
          <div key={photo.id} className={styles.photoCard}>
            <div className={styles.photos}>
              {/* 사진첩 사진 */}
              <Image
                src={photo.image_url}
                alt={`Photo by ${photo.nickname}`}
                width={190}
                height={190}
                className={styles.galleryImage}
                onClick={() => handleImageClick(index, photo.id)}
              />
            </div>
            <div key={photo.id}>{photo.nickname}</div>
          </div>
        ))}
      </div>
      <div className={styles.modal}>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className={styles.modalContainer}>
            <div className={styles.modalBox}>
              <div className={styles.modalNickname}>
                {galleryData[selectedImg.index]?.nickname}님의 사진
              </div>
              <div className={styles.photo}>
                {/* 모달창 안 사진 */}
                <Image
                  src={galleryData[selectedImg.index]?.image_url || ""}
                  alt={`Photo by ${galleryData[selectedImg.index]?.nickname}`}
                  width={360}
                  height={360}
                  className={styles.galleryModalImage}
                />
              </div>

              {userId === galleryData[selectedImg.index]?.creater_id ? ( 
              <div className={styles.deleteButton}>
                <Button
                  text="삭제하기"
                  size="sm"
                  color="--exit-red"
                  active={true}
                  onClick={() => handleDelete(selectedImg.id)}
                />
              </div> )  : null}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default GalleryDetail;
