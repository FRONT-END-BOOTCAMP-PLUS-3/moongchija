"use client";

import { AppointmentInfo } from "../page";
import styles from "./AppointmentList.module.scss";
import AppointmentCard from "./AppointmentCard";

interface AppointmentListProps {
  appointments: AppointmentInfo[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  return (
    <div className={styles.container}>
      {appointments.map((data, index) => (
        <AppointmentCard appointment={data} key={index} />
      ))}
    </div>
  );
};

export default AppointmentList;
