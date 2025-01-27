"use client";

import styles from "./AppointmentCard.module.scss";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoMdPin } from "react-icons/io";
import crown from "@/public/images/icons/crown.webp";
import {
  AppointmentInfo,
  calculateCountdown,
  formatDate,
  formatTime,
} from "../page";
import Image from "next/image";

interface AppointmentCardProps {
  appointment: AppointmentInfo;
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

  return (
    <div className={styles.container}>
      <section className={styles.leftBox}>
        <div className={styles.titleWrapper}>
          {isCreator ? (
            <Image src={crown} alt="logo" />
          ) : (
            <FaPeopleGroup size={25} />
          )}

          <span>{title}</span>
        </div>
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
        <div className={styles.countdown}>
          {confirmDate ? calculateCountdown(confirmDate) : "투표중"}
        </div>
        <div className={styles.locationWrapper}>
          {confirmPlace && (
            <>
              <IoMdPin size={30} color="red" />
              <span>{confirmPlace}</span>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default AppointmentCard;
