"use client";
import { Event } from "@/types/Event";
import AppointmentCount from "./AppointmentCount";
import styles from "./UserAppointmentCount.module.scss";

const UserAppointmentCount = ({
  appointments = [],
}: {
  appointments: Event[] | null;
}) => {
  const votingCount =
    appointments?.filter((appointment) => {
      return appointment.status;
    }).length ?? 0;

  const scheduledCount =
    appointments?.filter(
      (appointment) => appointment.status === "scheduledCount"
    ).length ?? 0;
  const confirmedCount =
    appointments?.filter(
      (appointment) => appointment.status === "confirmedCount"
    ).length ?? 0;

  const appointmentData = [
    { color: "greenColor", text: "투표중", count: votingCount },
    { color: "orangeColor", text: "예정", count: scheduledCount },
    { color: "pinkColor", text: "확정", count: confirmedCount },
  ];

  return (
    <div className={styles.appointmentCountBox}>
      {appointmentData.map((item, index) => (
        <AppointmentCount
          key={index}
          color={item.color}
          text={item.text}
          count={item.count}
        />
      ))}
    </div>
  );
};

export default UserAppointmentCount;
