"use client";
import AppointmentCount from "./AppointmentCount";
import styles from "./UserAppointmentCount.module.scss";
const appointmentData = [
  { color: "greenColor", text: "투표중" },
  { color: "orangeColor", text: "예정" },
  { color: "pinkColor", text: "확정" },
];

const UserAppointmentCount = () => {
  return (
    <div className={styles.appointmentCountBox}>
      {appointmentData.map((item, index) => (
        <AppointmentCount key={index} color={item.color} text={item.text} />
      ))}
    </div>
  );
};

export default UserAppointmentCount;
