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
        <Link href={`appointments/${data.id}/information`} key={index}>
          <AppointmentCard appointment={data} />
        </Link>
      ))}
    </div>
  );
};

export default AppointmentList;
