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

interface InformationDetailProps {
  informationData: Information;
}

const InformationDetail: FC<InformationDetailProps> = ({ informationData }) => {
  return (
    <div className={styles.container}>
      {/* 남은 날짜 박스 */}
      <div className={styles.dDay}>
        <span>D-1</span>
      </div>

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
          <Link href={String(informationData.place.link)}>{String(informationData.place.name)}</Link>
          {/* 장소 */}
        </div>

        {/* 일자 */}
        <div className={styles.date}>
          <FaCalendarAlt className={styles.calendarIcon} />
          <span>일자</span>
          <div className={styles.divider}></div>
          <span>{informationData.date}</span> 
        </div>

        {/* 참여 인원 */}
        <div className={styles.participants}>
          <FaUserFriends className={styles.friendsIcon} />
          <span>참여 인원</span>
          <div className={styles.divider}></div>
          <span>{informationData.participants.length}명</span>
          {/* 참여 인원 */}
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
