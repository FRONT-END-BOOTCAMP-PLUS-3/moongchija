"use client";

import styles from "./AppointmentList.module.scss";
import AppointmentCard from "./AppointmentCard";
import Link from "next/link";
import { AppointmentCardDto } from "@/application/usecases/appointment/dto/AppointmentCardDto";

interface AppointmentListProps {
  appointments: AppointmentCardDto[];
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments }) => {
  // 해당 약속 테이블 id를 가지고 있는 member 테이블에서 is_vote 속성을 찾은 후
  // is_vote가 true -> result 페이지
  // is_vote가 false -> vote 페이지

  return (
    <div className={styles.container}>
      {appointments.map((data, index) => (
        <Link href={`appointments/${data.id}/information`} key={index}>
          <AppointmentCard appointment={data} />
        </Link>
      ))}
      {/* 약속이 없을 경우 */}
      {appointments.length === 0 && (
        <p className={styles.message}>아직 약속이 없습니다.</p>
      )}
    </div>
  );
};

export default AppointmentList;
