"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./voteTime.module.scss";
import Button from "@/components/button/Button";
import { useParams, useRouter } from "next/navigation";
import ArrowHeader from "@/components/header/ArrowHeader";
import { useTimeVote } from "@/context/TimeVoteContext";

const VoteTimePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { selectedTimes, setSelectedTimes } = useTimeVote(); // Context 사용

  const [timeRange, setTimeRange] = useState<{
    id: number;
    start_time: string;
    end_time: string;
  } | null>(null);
  const [dateList, setDateList] = useState<string[]>([]);
  const [timeList, setTimeList] = useState<number[]>([]);
  const [gridSelected, setGridSelected] = useState<boolean[][]>([]);

  // 드래그 상태 관리
  const isDragging = useRef(false);
  const dragValue = useRef<boolean>(false);

  useEffect(() => {
    const fetchAppointmentTime = async () => {
      try {
        const response = await fetch(`/api/user/appointments/${id}/time-vote`);
        if (!response.ok) throw new Error("Failed to fetch appointment time");

        const data = await response.json();
        setTimeRange(data);

        const startDate = new Date(data.start_time);
        const endDate = new Date(data.end_time);

        const generatedDateList = getDateList(startDate, endDate);
        const generatedTimeList = getTimeList(
          startDate.getUTCHours(),
          endDate.getUTCHours()
        );

        setDateList(generatedDateList);
        setTimeList(generatedTimeList);

        // ✅ 데이터 로드 후 gridSelected 초기화
        setGridSelected(
          Array.from({ length: generatedTimeList.length }, () =>
            Array(generatedDateList.length).fill(false)
          )
        );
      } catch (error) {
        console.error("Error fetching appointment time:", error);
      }
    };

    if (id) fetchAppointmentTime();
  }, [id]);

  const getDateList = (start: Date, end: Date) => {
    const dates = [];
    const current = new Date(
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())
    );
    const endDate = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate())
    );
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    while (current <= endDate) {
      const year = current.getUTCFullYear();
      const month = String(current.getUTCMonth() + 1).padStart(2, "0");
      const day = String(current.getUTCDate()).padStart(2, "0");
      const dayOfWeek = daysOfWeek[current.getUTCDay()];
      dates.push(`${year}-${month}-${day}-${dayOfWeek}`);
      current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
  };

  const getTimeList = (startHour: number, endHour: number) => {
    return Array.from(
      { length: endHour - startHour + 1 },
      (_, i) => startHour + i
    );
  };

  const toggleCell = (row: number, col: number, isDrag: boolean = false) => {
    setGridSelected((prev) =>
      prev.map((r, i) =>
        i === row
          ? r.map((c, j) => (j === col ? (isDrag ? dragValue.current : !c) : c))
          : [...r]
      )
    );
  };

  const handleMouseDown = (row: number, col: number) => {
    isDragging.current = true;
    dragValue.current = !gridSelected[row][col];
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

  const saveSelectedTimes = () => {
    const selectedArray: string[] = [];

    gridSelected.forEach((row, rowIndex) => {
      row.forEach((isSelected, colIndex) => {
        if (isSelected) {
          const date = dateList[colIndex].split("-").slice(0, 3).join("-");
          const time = String(timeList[rowIndex]).padStart(2, "0");
          selectedArray.push(`${date} ${time}:00:00`);
        }
      });
    });

    if (selectedArray.length === 0) {
      alert("날짜를 선택해주세요");
      return;
    }

    setSelectedTimes(selectedArray); // Context에 저장
    router.push(`/user/appointments/${id}/vote-place`);
  };

  if (!dateList.length || !timeList.length) {
    return <p>📌 Loading... (날짜 또는 시간이 비어 있음)</p>; // 데이터 로딩 전 UI
  }

  return (
    <div className={styles.timeVoteContainer} onMouseUp={handleMouseUp}>
      <ArrowHeader />
      <div className={styles.mainBox}>
        <p className={styles.subtitle}>참여 가능한 시간을 선택해주세요.</p>
        <p className={styles.description}>
          클릭 혹은 드래그를 통해 가능한 영역을 선택해주세요.
        </p>

        <div className={styles.schedule}>
          <div className={styles.row}>
            <div className={styles.timeLabel}></div>
            {dateList.map((date, index) => (
              <div key={index} className={styles.weekDay}>
                {date.split("-")[3]}
              </div>
            ))}
          </div>
          <div className={styles.row}>
            <div className={styles.timeLabel}>시간</div>
            {dateList.map((date, index) => (
              <div key={index} className={styles.day}>
                {date.split("-")[2]}
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
              style={{ gridTemplateColumns: `repeat(${dateList.length}, 1fr)` }}
            >
              {timeList.map((_, rowIndex) =>
                dateList.map((_, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${styles.cell} ${
                      gridSelected[rowIndex][colIndex] ? styles.selected : ""
                    }`}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  ></div>
                ))
              )}
            </div>
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
