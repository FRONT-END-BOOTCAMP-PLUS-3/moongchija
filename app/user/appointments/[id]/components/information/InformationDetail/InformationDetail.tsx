import { FC } from "react";
import styles from "./InformationDetail.module.scss";
import Participants from "../Participants/Participants";
import {
  FaCrown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";
import Link from "next/link";
import { Information } from "../../detail/types/detailTypes";
import { calculateCountdown, formatTime } from "@/utils/dateUtils/dateUtils";

interface InformationDetailProps {
  informationData: Information;
}



const InformationDetail: FC<InformationDetailProps> = ({ informationData }) => {
 
  const formattedTime = formatTime(informationData.date);
  const countdown = calculateCountdown(informationData.date);

  const getCountdownClass = (countdown: string) => {
    if (countdown === "종료") return styles.end;
    if (countdown === "D-DAY") return styles.dDay;
    else return styles.count;
  };

  return (
    <div className={styles.container}>
      {/* 남은 날짜 박스 */}
      {/* <div className={styles.dDay}> */}
      <div className={`${styles.countdown} ${getCountdownClass(countdown)}`}>
          {countdown}
        </div>
      {/* </div> */}

      {/* 약속명 */}
      <div className={styles.name}>
        <FaCrown className={styles.crownIcon} />
        <span>{informationData.title}</span> 
      </div>

      {/* 장소 + 일자 + 참여인원 */}
      <div className={styles.box}>
        {/* 장소 */}
        <div className={styles.place}>
          <FaMapMarkerAlt className={styles.markerIcon} />
          <span>장소</span>
          <div className={styles.divider}></div>
          {informationData.place.link ? (
            <Link href={String(informationData.place.link)}>
              {String(informationData.place.name)}
            </Link>
          ) : (
            <span>{String(informationData.place.name)}</span>
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
            <Participants key={index} name={participant} /> 
          ))}
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;
