"use client";

import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import Button from "@/components/button/Button";
import styles from "./information.module.scss";
import InformationDetail from "../components/information/InformationDetail/InformationDetail";
import NoticeDetail from "../components/information/NoticeDetail/NoticeDetail";
import { useEffect, useState } from "react";
// import detailDummyData from "../components/detail/dummyData/detailDummyData";
import { useParams } from "next/navigation";
// import { detailTypes } from "../components/detail/types/detailTypes";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import { AppointmentInformationDto } from "@/application/usecases/appointment/dto/AppointmentInformationDto";
import { useRouter } from "next/navigation";

const InformationPage = () => {
  const { id } = useParams();
  const [infoData, setInfoData] = useState<AppointmentInformationDto>();
  const router = useRouter();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `/api/user/appointments/${id}/information`
        );
        if (!response.ok) throw new Error("약속 상세 정보 가져오기 실패");

        const data = await response.json();
        setInfoData(data);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) fetchPlaces();
  }, [id]);

  const handleCopyRoomId = () => {
    if (id) {
      const roomId = id as string;
      navigator.clipboard.writeText(roomId);
      alert("방번호가 복사되었습니다.");
      console.log(roomId);
    }
  };


  const handleViewResult = () => {
    router.push(`/user/appointments/${id}/vote-result`);
  };

  const handleChangeSchedule = () => {
    router.push(`/user/appointments/${id}/confirm`);
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

  return (
    <div className={styles.pageContainer}>
      <IconHeader />
      <DetailTabMenu />
      <div className={styles.container}>
        {!infoData ? (
          <div className={styles.loadingWrapper}>
            <Loading />
          </div>
        ) : (
          <>
            <InformationDetail informationData={infoData} />
            <NoticeDetail noticeData={infoData.notices} />
            <div className={styles.buttonWrapper}>
              <div className={styles.copyButton}>
                <Button
                  text="방 번호 복사"
                  size="sm"
                  color="--primary-color"
                  active={true}
                  onClick={handleCopyRoomId}
                />
              </div>

              <div className={styles.blueButtonWrapper}>
                <div className={styles.resultButton}>
                  <Button
                    text="투표 조회"
                    size="sm"
                    color="--secondary-color"
                    active={true}
                    onClick={handleViewResult}
                  />
                </div>

                <div className={styles.changeScheduleButton}>
                  <Button
                    text="일정 변경"
                    size="sm"
                    color="--secondary-color"
                    active={true}
                    onClick={handleChangeSchedule}
                  />
                </div>
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
                    text="방 나가기"
                    size="sm"
                    color="--exit-red"
                    active={true}
                    onClick={handleExitRoom}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InformationPage;
