"use client";
import { Event } from "@/types/Event";
import AppointmentCount from "./AppointmentCount";
import styles from "./UserAppointmentCount.module.scss";
import { getEventsStatus } from "@/utils/user/getEventsStatus";

const UserAppointmentCount = ({
  appointments = [],
  onStatusChange,
}: {
  appointments: Event[] | null;
  onStatusChange: (status: string | null) => void;
}) => {
  const getAppointmentCount = (status: string) => {
    return (
      appointments?.filter((appointment) => {
        const { status: appointmentStatus } = getEventsStatus(appointment);
        return appointmentStatus === status;
      }).length ?? 0
    );
  };

  const totalCount = appointments?.length ?? 0;
  const votingCount = getAppointmentCount("voting");
  const scheduledCount = getAppointmentCount("scheduled");
  const confirmedCount = getAppointmentCount("confirmed");

  const appointmentData = [
    { color: "blackColor", text: "전체", count: totalCount },
    { color: "greenColor", text: "투표중", count: votingCount },
    { color: "orangeColor", text: "예정", count: scheduledCount },
    { color: "pinkColor", text: "종료", count: confirmedCount },
  ];

  return (
    <div className={styles.appointmentCountBox}>
      {appointmentData.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            onStatusChange(
              item.text === "투표중"
                ? "voting"
                : item.text === "예정"
                ? "scheduled"
                : item.text === "종료"
                ? "confirmed"
                : null
            );
          }}
          className={styles.statusButton}
        >
          <AppointmentCount
            key={index}
            color={item.color}
            text={item.text}
            count={item.count}
          />
        </button>
      ))}
    </div>
  );
};

export default UserAppointmentCount;
