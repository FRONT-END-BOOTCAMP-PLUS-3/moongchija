"use client";

import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import Button from "@/components/button/Button";
import styles from "./information.module.scss";
import InformationDetail from "../components/information/InformationDetail/InformationDetail";
import NoticeDetail from "../components/information/NoticeDetail/NoticeDetail";
import { useEffect, useState } from "react";
import detailDummyData from "../components/detail/dummyData/detailDummyData";
import { useParams } from "next/navigation";
import { detailTypes } from "../components/detail/types/detailTypes";
import IconHeader from "@/components/header/IconHeader";

const InformationPage = () => {
  const { id } = useParams();
  const [detail, setDetail] = useState<detailTypes | null>(null);

  useEffect(() => {
    if (id) {
      const appointmentDetail = detailDummyData.find(
        (data) => data.id === Number(id)
      );
      setDetail(appointmentDetail || null);
    }
  }, [id]);

  const handleCopyRoomNumber = () => {
    alert("방 번호가 복사 되었습니다.");
  };

  const handleDeleteRoom = () => {
    const confirmation = confirm(
      "방을 삭제하면 해당 약속과 관련된 정보가 전부 사라지게 됩니다. 방을 정말 삭제 하시겠습니까?"
    );
    if (confirmation) {
      alert("방이 삭제되었습니다.");
    }
  };

  const handleExitRoom = () => {
    const confirmation = confirm("방을 정말 나가시겠습니까?");
    if (confirmation) {
      alert("방을 나갔습니다.");
    }
  };

  if (!detail) return <div>Loading...</div>;

  return (
    <div className={styles.pageContainer}>
      <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        <InformationDetail informationData={detail.information} />

        <NoticeDetail noticeData={detail.notice} />

        <div className={styles.buttonWrapper}>
          <div className={styles.copyButton}>
            <Button
              text="방 번호 복사"
              size="sm"
              color="--primary-color"
              active={true}
              onClick={handleCopyRoomNumber}
            />
          </div>

          <div className={styles.redButtonWrapper}>
            <div className={styles.deleteButton}>
              <Button
                text="삭제하기"
                size="sm"
                color="--exit-red"
                active={true}
                onClick={handleDeleteRoom}
              />
            </div>

            <div className={styles.exitButton}>
              <Button
                text="나가기"
                size="sm"
                color="--exit-red"
                active={true}
                onClick={handleExitRoom}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationPage;
