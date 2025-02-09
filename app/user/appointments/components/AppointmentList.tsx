"use client";

import styles from "./AppointmentList.module.scss";
import AppointmentCard from "./AppointmentCard";
import Link from "next/link";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";

interface AppointmentListProps {
  appointments: AppointmentCardDto[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <div className={styles.container}>
      {appointments.map((data, index) => (
        <Link
          href={`appointments/${data.id}/${
            data.status === "confirmed"
              ? "information"
              : data.isVote
              ? "vote-result"
              : "vote-time"
          }`}
          key={index}
        >
          <AppointmentCard appointment={data} />
        </Link>
      ))}
      {/* 약속이 없을 경우 */}
      {appointments.length === 0 && (
        <p className={styles.message}>약속이 비어있습니다.</p>
      )}
    </div>
  );
};

export default AppointmentList;
