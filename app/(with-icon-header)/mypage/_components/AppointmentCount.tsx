import styles from "./AppointmentCount.module.scss";

const AppointmentCount = ({ color, text }: { color: string; text: string }) => {
  return (
    <div className={`${styles.appointmentContainer} ${styles[color]}`}>
      <div className={styles.spanBox}>
        <span>7</span>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default AppointmentCount;
