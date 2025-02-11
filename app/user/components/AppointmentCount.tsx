"use client";
import styles from "./AppointmentCount.module.scss";

const AppointmentCount = ({
  color,
  text,
  count,
}: {
  color: string;
  text: string;
  count: number;
}) => {
  return (
    <div className={`${styles.appointmentContainer} ${styles[color]}`}>
      <div className={styles.spanBox}>
        <span>{count}</span>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default AppointmentCount;
