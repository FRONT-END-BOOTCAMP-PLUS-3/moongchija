import styles from "./InformationDetail.module.scss";
import {
  FaCrown,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUserFriends,
  FaSmile,
} from "react-icons/fa";

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
          <FaMapMarkerAlt />
          <span>장소</span>
          <div>|</div>
          <a href="#">홍대입구역</a>
        </div>

        {/* 일자 */}
        <div className={styles.date}>
          <FaCalendarAlt />
          <span>일자</span>
          <div>|</div>
          <span>2015.1.17 (금) 18:00</span>
        </div>

        {/* 참여 인원 */}
        <div className={styles.participants}>
          <FaUserFriends />
          <span>참여 인원</span>
          <div>|</div>
          <span>3명</span>
        </div>

        {/* 참여 인원 하단 박스 */}
        <div className={styles.participantsBox}>
          <div className={styles.participants}>
            <FaSmile />
            <span>고뭉치</span>
          </div>
          <div className={styles.participants}>
            <FaSmile />
            <span>고뭉치</span>
          </div>
          <div className={styles.participants}>
            <FaSmile />
            <span>고뭉치</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationDetail;
