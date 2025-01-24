"use client"

import styles from "./InformationDetail.module.scss";
import Participants from "../Participants/Participants";
import {
  FaCrown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
} from "react-icons/fa";
import Link from "next/link"; 

const InformationDetail = () => {
  return (
    <div className={styles.container}>
      {/* 남은 날짜 박스 */}
      <div className={styles.dDay}>
        <span>D-1</span>
      </div>

      {/* 약속명 */}
      <div className={styles.name}>
        <FaCrown className={styles.crownIcon} />
        <span>저녁에 닭발</span>
      </div>

      {/* 장소 + 일자 + 참여인원 */}
      <div className={styles.box}>
        {/* 장소 */}
        <div className={styles.place}>
          <FaMapMarkerAlt className={styles.markerIcon} />
          <span>장소</span>
          <div className={styles.divider}></div>
          <Link href="/location">홍대입구역</Link>  
           {/* 링크 추후 변경 */}
        </div>

        {/* 일자 */}
        <div className={styles.date}>
          <FaCalendarAlt className={styles.calendarIcon} />
          <span>일자</span>
          <div className={styles.divider}></div>
          <span>2015.1.17 (금) 18:00</span>
        </div>

        {/* 참여 인원 */}
        <div className={styles.participants}>
          <FaUserFriends className={styles.friendsIcon} />
          <span>참여 인원</span>
          <div className={styles.divider}></div>
          <span>3명</span>
        </div>

        {/* 참여 인원 하단 박스 */}
        <div className={styles.participantsBox}>
          <Participants />
          <Participants />
          <Participants />
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;
