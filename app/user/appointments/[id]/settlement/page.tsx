"use client";

import { useEffect, useState } from "react";
import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import SettlementDetail from "../components/settlement/SettlementDetail/SettlementDetail";
import styles from "./settlement.module.scss";
import { useParams } from "next/navigation";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import { SettlementDto } from "@/application/usecases/appointment/dto/SettlementDto";
import CircleButton from "@/components/circleButton/CircleButton";
import SettlementModalNew from "../components/settlement/SettlementModalNew/SettlementModalNew";
import Modal from "@/components/modal/Modal";

const SettlementPage = () => {
  const { id } = useParams();

  const [settlementData, setSettlementData] = useState<SettlementDto | null>(
    null
  );
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(false); // API 호출 실패 상태
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const openNewModal = () => {
    setIsNewModalOpen(true);
  };

  const closeNewModal = () => {
    setIsNewModalOpen(false);
  };

  const fetchSettlement = async () => {
    try {
      setLoading(true);
      setError(false); // 요청 시작 시 에러 상태 초기화

      const response = await fetch(`/api/user/appointments/${id}/settlement`);

      if (response.status === 404) {
        setSettlementData(null); // 정산 데이터가 없음
      } else if (!response.ok) {
        throw new Error("서버 오류");
      } else {
        const data = await response.json();
        setSettlementData(data);
      }
    } catch (error) {
      console.error(error);
      setError(true); // API 호출 실패
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSettlement();
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
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </div>
    );
  }

  if (settlementData === null) {
    return (
      <>
        <div className={styles.pageContainer}>
          <IconHeader />
          <DetailTabMenu />
          <div className={styles.noSettlementContainer}>
            <div className={styles.noSettlement}>등록된 정산이 없습니다</div>
            <div className={styles.editButton}>
              <CircleButton onClick={openNewModal} />
            </div>
          </div>
        </div>

        {/* 새로운 정산 작성 모달 컴포넌트 */}
        <Modal isOpen={isNewModalOpen} onClose={closeNewModal}>
          <SettlementModalNew
            appointmentId={Number(id)}
            onSuccess={() => {
              closeNewModal();
              fetchSettlement(); // 등록 후 최신 데이터 재조회
            }}
          />
        </Modal>
      </>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        <SettlementDetail settlementData={settlementData} fetchSettlement={fetchSettlement}  />
      </div>
    </div>
  );
};

export default SettlementPage;
