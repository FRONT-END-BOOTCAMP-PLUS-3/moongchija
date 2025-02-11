"use client";

import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
import styles from "./information.module.scss";
import InformationDetail from "../components/information/InformationDetail/InformationDetail";
import NoticeDetail from "../components/information/NoticeDetail/NoticeDetail";
import { useCallback, useEffect, useState} from 'react';
import { useParams } from "next/navigation";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import { AppointmentInformationDto } from "@/application/usecases/appointment/dto/AppointmentInformationDto";
import { useRouter } from "next/navigation";
import { getUserIdClient } from "@/utils/supabase/client";
import CircleButton from "@/components/circleButton/CircleButton";

const InformationPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [infoData, setInfoData] = useState<AppointmentInformationDto>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  const handleCircleButtonClick = () => setShowButtons((prev) => !prev);

  const fetchInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/user/appointments/${id}/information`);
      if (!response.ok) throw new Error("약속 상세 정보 가져오기 실패");
  
      const data = await response.json();
      setInfoData(data);
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  
  useEffect(() => {
    if (id) fetchInfo();
  }, [id, fetchInfo]);

  useEffect(() => {
    const fetchUserId = async () => {
      const fetchedUserId = await getUserIdClient();
      setUserId(fetchedUserId);
    };
    fetchUserId();
  }, []);

  // 방번호 복사 버튼
  const handleCopyRoomId = () => {
    if (id) {
      const roomId = id as string;
      navigator.clipboard.writeText(roomId);
      alert("방번호가 복사되었습니다.");
    }
  };

  // 투표 결과 버튼
  const handleViewResult = () => {
    router.push(`/user/appointments/${id}/vote-result`);
  };

  // 일정 변경 버튼
  const handleChangeSchedule = () => {
    router.push(`/user/appointments/${id}/confirm`);
  };

  // 방삭제 버튼
  const handleDeleteRoom = async (appointmentId: number) => {
    if (!confirm("정말 이 약속을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/appointments/${appointmentId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("약속 삭제 실패");

      const confirmation = confirm(
        "방을 삭제하면 해당 약속과 관련된 정보가 전부 사라지게 됩니다. 방을 정말 삭제 하시겠습니까?"
      );

      if (confirmation) {
        alert("방이 삭제되었습니다.");
        setInfoData(undefined);
        router.push(`/user/appointments`);
      } else {
        alert("약속 삭제를 취소했습니다.");
      }
    } catch (error) {
      console.error("방 삭제 중 오류 발생:", error);
      alert("방 삭제 중 오류가 발생했습니다.");
    }
  };

  // 방 나가기 버튼
  const handleExitRoom = async () => {
    if (!confirm("정말 방을 나가시겠습니까?")) return;

    try {
      const res = await fetch(`/api/user/appointments/${id}/member`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "방 나가기 실패");
      }

      alert("방을 나갔습니다.");
      router.push("/user/appointments");
    } catch (error) {
      console.error("방 나가기 중 오류 발생:", error);
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
            <NoticeDetail
              noticeData={infoData.notices}
              appointmentId={Number(id)}
              ownerId={infoData.owner_id}
              userId={userId}
            />
            {/* 동그라미 플러스 버튼 */}
            <CircleButton onClick={handleCircleButtonClick} />
            <section
              className={`${styles.buttonBox} ${
                showButtons ? styles.show : ""
              }`}
              onClick={handleCircleButtonClick}
            >
              <button onClick={handleCopyRoomId} className={styles.copyButton}>
                방번호로 복사
              </button>
              <button
                className={styles.resultButton}
                type="button"
                onClick={handleViewResult}
              >
                투표 조회
              </button>
              {userId === infoData.owner_id ? ( // 방장이면, 일정변경 가능
                <button
                  className={styles.changeScheduleButton}
                  type="button"
                  onClick={handleChangeSchedule}
                >
                  일정 변경
                </button>
              ) : null}
              {userId === infoData.owner_id ? ( // 방장이면, 방 삭제 가능
                <button
                  className={styles.deleteButton}
                  type="button"
                  onClick={() => handleDeleteRoom(Number(id))}
                >
                  삭제 하기
                </button>
              ) : null}
              {userId !== infoData.owner_id ? ( // 멤버면, 방 나가기
              <button
                className={styles.exitButton}
                type="button"
                onClick={handleExitRoom}
              >
                방 나가기
              </button>
            ) : null}
            </section>

            
          </>
        )}
      </div>
    </div>
  );
};

export default InformationPage;
