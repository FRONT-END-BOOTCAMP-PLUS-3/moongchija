"use client";

import styles from "./AppointmentCard.module.scss";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import { calculateCountdown, formatDate, AppointmentInfo, formatTime } from "../page";

interface AppointmentCardProps {
  appointment: AppointmentInfo;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const {
    title,
    startDate,
    endDate,
    participants,
    extraParticipants,
    location,
  } = appointment;

  return (
    <div className={styles.container}>
      <section className={styles.leftBox}>
        <div className={styles.titleWrapper}>
          <FaPeopleGroup size={25} />
          <span>{title}</span>
        </div>
        <div className={styles.dateWrapper}>
          <p>{`${formatTime(startDate)} ~`}</p>
          <p>{`${formatDate(endDate)}`}</p>
        </div>
        <div className={styles.participantWrapper}>
          <span className={styles.participants}>{participants.join("")}</span>
          {extraParticipants > 0 && (
            <span className={styles.extraParticipants}>
              외 {extraParticipants}명
            </span>
          )}
        </div>
      </section>
      <section className={styles.rightBox}>
        <div className={styles.countdown}>{calculateCountdown(startDate)}</div>
        <div className={styles.locationWrapper}>
          <IoMdPin size={30} color="red" />
          <span>{location}</span>
        </div>
      </section>
    </div>
  );
};

export default AppointmentCard;
