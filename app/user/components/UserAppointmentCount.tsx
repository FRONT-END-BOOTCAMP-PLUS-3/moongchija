"use client";
import { Event } from "@/types/Event";
import AppointmentCount from "./AppointmentCount";
import styles from "./UserAppointmentCount.module.scss";
import { getEventsStatus } from "@/utils/user/getEventsStatus";

const UserAppointmentCount = ({
  appointments = [],
}: {
  appointments: Event[] | null;
}) => {
  const getAppointmentCount = (status: string) => {
    return (
      appointments?.filter((appointment) => {
        const { status: appointmentStatus } = getEventsStatus(appointment);
        return appointmentStatus === status;
      }).length ?? 0
    );
  };

  const votingCount = getAppointmentCount("voting");
  const scheduledCount = getAppointmentCount("scheduled");
  const confirmedCount = getAppointmentCount("confirmed");

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
