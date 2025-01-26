import styles from "./TimeResult.module.scss";

interface TimeRange {
  start_time: string; // "2025-01-02 12:00:00"
  end_time: string; // "2025-01-10 22:00:00"
}

const TimeResult = () => {
  const timeRange: TimeRange = {
    start_time: "2025-01-01 12:00:00",
    end_time: "2025-01-07 22:00:00",
  };
  // 날짜 및 시간 목록 생성 함수
  const getDateList = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    ); // 시간 제거
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate()); // 시간 제거

    // 요일 배열 (일요일부터 토요일까지)
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dayOfWeek = daysOfWeek[current.getDay()]; // 요일 가져오기

      dates.push(`${year}-${month}-${day}-${dayOfWeek}`);

      current.setDate(current.getDate() + 1); // 다음 날짜로 이동
    }

    return dates;
  };
  const getTimeList = (start: number, end: number) => {
    if (start < 0 || end > 23 || start > end) {
      throw new Error("Invalid time range. Ensure 0 <= start <= end <= 23.");
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  // start_time, end_time을 Date로 변환
  const startDate = new Date(timeRange.start_time);
  const endDate = new Date(timeRange.end_time);

  // 날짜 및 시간 리스트 생성
  const dateList = getDateList(startDate, endDate);
  const timeList = getTimeList(startDate.getHours(), endDate.getHours());

  return (
    <div className={styles.schedule}>
      <div className={styles.row}>
        <div className={styles.timeLabel}></div>
        {dateList.map((date, index) => (
          <div key={index} className={styles.weekDay}>
            {date.split("-")[3]} {/* "01-02" 형식 */}
          </div>
        ))}
      </div>
      <div className={styles.row}>
        <div className={styles.timeLabel}>시간</div>
        {dateList.map((date, index) => (
          <div key={index} className={styles.day}>
            {date.split("-")[2]} {/* "01-02" 형식 */}
          </div>
        ))}
      </div>

      <div className={styles.timeGrid}>
        <div className={styles.timeLabels}>
          {timeList.map((hour) => (
            <div key={hour} className={styles.time}>
              {hour}
            </div>
          ))}
        </div>

        <div
          className={styles.grid}
          style={{ gridTemplateColumns: `repeat(${dateList.length}, 1fr)` }} // ✅ 날짜 개수만큼 컬럼 설정
        >
          {timeList.map((_, rowIndex) =>
            dateList.map((_, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`${styles.cell} ${styles.selected}`}
              ></div>
            ))
          )}
        </div>
      </div>
      <div className={styles.votePerson}>
        <div>
          <span className={styles.possible}>가능</span>
          <ul>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
          </ul>
        </div>
        <div>
          <span className={styles.impossible}>불가능</span>
          <ul>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
            <li>고뭉치</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TimeResult;
