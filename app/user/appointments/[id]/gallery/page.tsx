"use client";

import { useState, useEffect } from "react";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import GalleryDetail from "../components/gallery/GalleryDetail/GalleryDetail";
import styles from "./gallery.module.scss";
import { useParams } from "next/navigation";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import CircleButton from "@/components/circleButton/CircleButton";
import Modal from "@/components/modal/Modal";
import SettlementModalNew from "../components/settlement/SettlementModalNew/SettlementModalNew";
import { ImageListDto } from "@/application/usecases/appointmentImage/dto/ImageListDto";

const GalleryPage = () => {
  const { id } = useParams();
  const [galleryData, setGalleryData] = useState<ImageListDto[]>([]); // 약속 이미지 데이터 배열
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const openNewModal = () => {
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
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
          <p className={styles.errorMessage}>이미지 데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        {/* galleryData를 GalleryDetail에 전달 */}
        <GalleryDetail galleryData={galleryData} />
      </div>

      <Modal isOpen={isNewModalOpen} onClose={closeNewModal}>
        <SettlementModalNew
          appointmentId={Number(id)}
          onSuccess={() => {
            closeNewModal();
            fetchGallery(); // 모달에서 이미지 추가 후 최신 이미지 재조회
          }}
        />
      </Modal>

      <CircleButton onClick={openNewModal} />
    </div>
  );
};

export default GalleryPage;
