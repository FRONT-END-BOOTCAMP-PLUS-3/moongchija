import { FC, useEffect, useState } from "react";
import styles from "./InformationDetail.module.scss";
import Participants from "../Participants/Participants";
import {
  FaCrown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";
import Link from "next/link";
import { calculateCountdown, formatTime } from "@/utils/dateUtils/dateUtils";
import { AppointmentInformationDto } from "../../../../../../../../application/usecases/appointment/dto/AppointmentInformationDto";
import { getUserIdClient } from "@/utils/supabase/client";

interface InformationDetailProps {
  informationData: AppointmentInformationDto;
}

const InformationDetail: FC<InformationDetailProps> = ({ informationData }) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const fetchedUserId = await getUserIdClient();
      setUserId(fetchedUserId);
    };
    fetchUserId();
  }, []);

  const safeParseDate = (date: Date | undefined): Date | undefined => {
    if (!date) return undefined;
    return date instanceof Date ? date : new Date(date);
  };

  const formattedTime = formatTime(
    safeParseDate(informationData.confirmDate) ?? new Date()
  );
  const countdown = calculateCountdown(
    safeParseDate(informationData.confirmDate) ?? new Date()
  );

  const getCountdownClass = (countdown: string) => {
    if (countdown === "종료") return styles.end;
    if (countdown === "D-DAY") return styles.dDay;
    else return styles.count;
  };

  return (
    <div className={styles.container}>
      {/* 남은 날짜 박스 */}

      <div className={`${styles.countdown} ${getCountdownClass(countdown)}`}>
        {countdown}
      </div>

      {/* 약속명 */}
      <div className={styles.name}>
        {userId === informationData.owner_id ? (
          <FaCrown className={styles.crownIcon} />
        ) : (
          <FaUserFriends className={styles.friendsIcon} />
        )}
        <span>{informationData.title}</span>
      </div>

      {/* 장소 + 일자 + 참여인원 */}
      <div className={styles.box}>
        {/* 장소 */}
        <div className={styles.place}>
          <FaMapMarkerAlt className={styles.markerIcon} />
          <span>장소</span>
          <div className={styles.divider}></div>
          {informationData.confirmPlaceUrl ? (
            <Link
              href={String(informationData.confirmPlaceUrl)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {String(informationData.confirmPlace)}
            </Link>
          ) : (
            <span>{String(informationData.confirmPlace)}</span>
          )}
        </div>

        {/* 일자 */}
        <div className={styles.date}>
          <FaCalendarAlt className={styles.calendarIcon} />
          <span>일자</span>
          <div className={styles.divider}></div>
          <span>{formattedTime}</span>
        </div>

        {/* 참여 인원 */}
        <div className={styles.participants}>
          <FaUserFriends className={styles.friendsIcon} />
          <span>참여 인원</span>
          <div className={styles.divider}></div>
          <span>{informationData.participants.length}명</span>
        </div>

        {/* 참여 인원 하단 박스 */}
        <div className={styles.participantsBox}>
          {informationData.participants.map((participant, index) => (
            <Participants key={index} participant={participant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;
