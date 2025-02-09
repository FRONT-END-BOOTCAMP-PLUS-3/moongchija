"use client";

import styles from "./AppointmentCard.module.scss";
import { FaCrown, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import {
  calculateCountdown,
  formatDate,
  formatTime,
} from "@/utils/dateUtils/dateUtils";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";
import Image from "next/image";

interface AppointmentCardProps {
  appointment: AppointmentCardDto;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const basicUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const {
    title,
    startDate,
    endDate,
    confirmDate,
    confirmPlace,
    participants,
    isCreator,
    extraParticipants,
  } = appointment;

  const countdown = confirmDate ? calculateCountdown(confirmDate) : "투표중";

  const getCountdownClass = (countdown: string) => {
    if (countdown === "종료") return styles.end;
    if (countdown === "D-DAY") return styles.dDay;
    else return styles.count;
  };

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>, text: string) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await navigator.clipboard.writeText(text);
      alert(`✅ 초대링크가 복사되었습니다! ${text}`);
    } catch {
      alert("초대링크 복사 실패");
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
                onClick={(e) => handleCopy(e, `${basicUrl}/user/appointments/${appointment.id}/entry`)}
                className={styles.copyButton}
              >
                <FiCopy />
                <p>복사</p>
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AppointmentCard;
