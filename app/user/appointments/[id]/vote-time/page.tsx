"use client";

import { useState, useRef, use } from "react";
import styles from "./voteTime.module.scss";
import Button from "@/components/button/Button";
import { usePathname, useRouter } from "next/navigation";

interface TimeRange {
  start_time: string; // "2025-01-02 12:00:00"
  end_time: string; // "2025-01-10 22:00:00"
}

const VoteTimePage: React.FC = () => {
  const router = useRouter(); // useRouter 훅 사용 -> router.push로 페이지 이동을위해 사용

  const pathname = usePathname();
  const id = pathname.split("/").slice(-2, -1)[0]; // 경로에서 ID 추출

  const timeRange: TimeRange = {
    start_time: "2025-01-01 00:00:00",
    end_time: "2025-01-07 23:00:00",
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

  // 선택된 시간 상태 (2D 배열)
  const [selectedTimes, setSelectedTimes] = useState<boolean[][]>(
    Array(timeList.length).fill(Array(dateList.length).fill(false))
  );

  // 드래그 상태 관리
  const isDragging = useRef(false);
  const dragValue = useRef<boolean>(false);

  const toggleCell = (row: number, col: number, isDrag: boolean = false) => {
    setSelectedTimes((prev) =>
      prev.map((r, i) =>
        i === row
          ? r.map((c, j) => (j === col ? (isDrag ? dragValue.current : !c) : c))
          : r
      )
    );
  };

  const handleMouseDown = (row: number, col: number) => {
    isDragging.current = true;
    dragValue.current = !selectedTimes[row][col];
    toggleCell(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging.current) {
      toggleCell(row, col, true);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // 선택된 시간들을 배열에 담는 함수
  const saveSelectedTimes = () => {
    const selectedArray: string[] = [];

    selectedTimes.forEach((row, rowIndex) => {
      row.forEach((isSelected, colIndex) => {
        if (isSelected) {
          const date = dateList[colIndex].split("-").slice(0, 3).join("-"); // 날짜 (YYYY-MM-DD)
          const time = String(timeList[rowIndex]).padStart(2, "0"); // 시간 (HH)
          selectedArray.push(`${date} ${time}:00:00`); // "YYYY-MM-DD HH:00:00"
        }
      });
    });

    if (selectedArray.length === 0) {
      alert("날짜를 선택해주세요");
    } else {
      alert(selectedArray);
      router.push(`/user/appointments/${id}/vote-place`); // 장소투표 페이지로 이동
    }
  };

  return (
    <div className={styles.timeVoteContainer} onMouseUp={handleMouseUp}>
      <div>
        <p className={styles.subtitle}>참여 가능한 시간을 선택해주세요.</p>
        <p className={styles.description}>
          클릭 혹은 드래그를 통해 가능한 영역을 선택해주세요.
        </p>
      </div>

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
                  className={`${styles.cell} ${
                    selectedTimes[rowIndex][colIndex] ? styles.selected : ""
                  }`}
                  onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                ></div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className={styles.wrapButton}>
        <Button
          text="장소투표 하러가기"
          size="lg"
          onClick={saveSelectedTimes}
        />
      </div>
    </div>
  );
};

export default VoteTimePage;
