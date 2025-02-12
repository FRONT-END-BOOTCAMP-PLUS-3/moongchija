"use client";

import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";
import { fallbackCopy } from "@/utils/copy/copyUtils";
import {
  calculateCountdown,
  formatDate,
  formatTime,
} from "@/utils/dateUtils/dateUtils";
import Image from "next/image";
import { FaCrown, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { IoMdExit } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import styles from "./AppointmentCard.module.scss";
import { useUser } from "@/context/UserContext";

interface AppointmentCardProps {
  appointment: AppointmentCardDto;
  onSetAppointments: React.Dispatch<React.SetStateAction<AppointmentCardDto[]>>;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onSetAppointments,
}) => {
  const basicUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const { user } = useUser();

  const {
    id,
    title,
    startDate,
    endDate,
    confirmDate,
    confirmPlace,
    participants,
    isCreator,
    extraParticipants,
    ownerId,
  } = appointment;

  const countdown = confirmDate ? calculateCountdown(confirmDate) : "투표중";

  const getCountdownClass = (countdown: string) => {
    if (countdown === "종료") return styles.end;
    if (countdown === "D-DAY") return styles.dDay;
    else return styles.count;
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    e.preventDefault();
    e.stopPropagation();

    fallbackCopy(text, () => {}, "초대링크 복사 실패");
    alert(`✅ 초대링크가 복사되었습니다! ${text}`);
  };

  // 방삭제 버튼
  const handleDeleteRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("정말 이 약속을 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("약속 삭제 실패");

      const confirmation = confirm(
        "방을 삭제하면 해당 약속과 관련된 정보가 전부 사라지게 됩니다. 방을 정말 삭제 하시겠습니까?"
      );

      if (confirmation) {
        alert("방이 삭제되었습니다.");
        onSetAppointments((prev) => prev.filter((app) => app.id !== id));
      }
    } catch (error) {
      console.log("방 삭제 중 오류 발생:", error);
      alert("방 삭제 중 오류가 발생했습니다.");
    }
  };

  // 방 나가기 버튼
  const handleExitRoom = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("정말 방을 나가시겠습니까?")) return;

    try {
      const res = await fetch(
        `/api/user/appointments/${id}/information/member`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "방 나가기 실패");
      }

      alert("방을 나갔습니다.");
      onSetAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.log("방 나가기 중 오류 발생:", error);
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.leftBox}>
        {/* 제목 */}
        <div className={styles.titleWrapper}>
          {isCreator ? (
            <FaCrown size={22} color={"gold"} />
          ) : (
            <FaUserFriends size={22} />
          )}
          <span>{title}</span>
        </div>
        {/* 일자 */}
        <div className={styles.dateWrapper}>
          <p>
            {confirmDate
              ? `${formatTime(confirmDate)}`
              : startDate
              ? `${formatTime(startDate)} ~`
              : ""}
          </p>
          <p>{confirmDate ? "" : `${formatDate(endDate!)}`}</p>
        </div>
        {/* 참여 인원 */}
        <div className={styles.participantWrapper}>
          {participants.map((participant, index) => (
            <Image
              className={styles.participantImage}
              src={participant}
              alt={`Participant ${index + 1}`}
              key={index}
              width={20}
              height={20}
            />
          ))}

          {extraParticipants > 0 && (
            <span className={styles.extraParticipants}>
              외 {extraParticipants}명
            </span>
          )}
        </div>
      </section>
      <section className={styles.rightBox}>
        {/* D-Day */}
        <div className={`${styles.countdown} ${getCountdownClass(countdown)}`}>
          {countdown}
        </div>
        {/* 장소 */}
        <div className={styles.locationWrapper}>
          {confirmPlace && (
            <>
              <FaMapMarkerAlt color={"rgb(90, 90, 244)"} />
              <span>{confirmPlace}</span>
            </>
          )}
        </div>
        {/* 링크 */}
        <div className={styles.linkWrapper}>
          {!confirmPlace && (
            <>
              <button
                onClick={(e) =>
                  handleCopy(
                    e,
                    `${basicUrl}/user/appointments/${appointment.id}/entry`
                  )
                }
                className={styles.linkButton}
              >
                <FiCopy />
                <p>초대 링크</p>
              </button>
              {ownerId === user?.id ? ( // 방장이면, 방 삭제 가능
                <button
                  onClick={handleDeleteRoom}
                  className={styles.linkButton}
                >
                  <MdDeleteOutline />
                  <p>방 삭제</p>
                </button>
              ) : ( // 멤버면, 방 나가기 가능
                <button
                  onClick={handleExitRoom}
                  className={styles.linkButton}
                >
                  <IoMdExit />
                  <p>방 나가기</p>
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AppointmentCard;
