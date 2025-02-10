"use client";

import DetailTabMenu from "../components/detail/DetailTabMenu/DetailTabMenu";
// import Button from "@/components/button/Button";
import styles from "./information.module.scss";
import InformationDetail from "../components/information/InformationDetail/InformationDetail";
import NoticeDetail from "../components/information/NoticeDetail/NoticeDetail";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import IconHeader from "@/components/header/IconHeader";
import Loading from "@/components/loading/Loading";
import { AppointmentInformationDto } from "@/application/usecases/appointment/dto/AppointmentInformationDto";
import { useRouter } from "next/navigation";
import { getUserIdClient } from "@/utils/supabase/client";

const InformationPage = () => {
  const params = useParams();
  const id = params.id as string;

  const [infoData, setInfoData] = useState<AppointmentInformationDto>();
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const fetchInfo = async () => {
    try {
      const response = await fetch(`/api/user/appointments/${id}/information`);
      if (!response.ok) throw new Error("약속 상세 정보 가져오기 실패");

      const data = await response.json();
      setInfoData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (id) fetchInfo();
  }, [id]);

  useEffect(() => {
    const fetchUserId = async () => {
      const fetchedUserId = await getUserIdClient();
      setUserId(fetchedUserId);
    };
    fetchUserId();
  }, []);

  const handleCopyRoomId = () => {
    if (id) {
      const roomId = id as string;
      navigator.clipboard.writeText(roomId);
      alert("방번호가 복사되었습니다.");
    }
  };

  const handleViewResult = () => {
    router.push(`/user/appointments/${id}/vote-result`);
  };

  const handleChangeSchedule = () => {
    router.push(`/user/appointments/${id}/confirm`);
  };

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
        await fetchInfo();
      } else {
        alert("약속 삭제를 취소했습니다.");
      }
    } catch (error) {
      console.error("방 삭제 중 오류 발생:", error);
      alert("방 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleExitRoom = async () => {
    if (!confirm("정말 방을 나가시겠습니까?")) return;

    try {
      const res = await fetch(
        `/api/user/appointments/${id}/information/member`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

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
            />
            <div className={styles.buttonWrapper}>
              <button
                type="button"
                className={styles.copyButton}
                onClick={handleCopyRoomId}
              >
                방번호 복사
              </button>

              <div className={styles.blueButtonWrapper}>
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
              </div>

              <div className={styles.redButtonWrapper}>
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
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InformationPage;
