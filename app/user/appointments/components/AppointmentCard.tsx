"use client";

import styles from "./AppointmentCard.module.scss";
import { FaCrown, FaMapMarkerAlt, FaUserFriends } from "react-icons/fa";
import { calculateCountdown, formatDate, formatTime } from "@/utils/dateUtils/dateUtils";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";
import Image from "next/image";

interface AppointmentCardProps {
  appointment: AppointmentCardDto;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
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
            {startDate
              ? `${formatTime(startDate)} ~`
              : confirmDate
              ? `${formatTime(confirmDate)}`
              : ""}
          </p>
          <p>{endDate && `${formatDate(endDate)}`}</p>
        </div>
        {/* 참여 인원 */}
        <div className={styles.participantWrapper}>
          {participants.map((participant, index) => (
            <Image src={participant} alt={`Participant ${index + 1}`} key={index} width={20} height={20}/>
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
      </section>
    </div>
  );
};

export default AppointmentCard;
