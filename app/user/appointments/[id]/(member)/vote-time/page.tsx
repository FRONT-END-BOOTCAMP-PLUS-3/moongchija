"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./voteTime.module.scss";
import Button from "@/components/button/Button";
import { useParams, useRouter } from "next/navigation";
import { useTimeVote } from "@/context/TimeVoteContext";
import Loading from "@/components/loading/Loading";

const VoteTimePage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { setSelectedTimes } = useTimeVote(); // Context 사용

  const [dateList, setDateList] = useState<string[]>([]);
  const [timeList, setTimeList] = useState<number[]>([]);
  const [gridSelected, setGridSelected] = useState<boolean[][]>([]);

  // 드래그 상태 관리
  const isDragging = useRef(false);
  const dragValue = useRef<boolean>(false);
  const lastTouchedCell = useRef<{ row: number; col: number } | null>(null); // 터치 드래그 중 같은 셀을 반복적으로 처리하지 않도록 방지
  const touchTimeout = useRef<NodeJS.Timeout | null>(null); // 단순 터치인지 드래그인지 구분

  useEffect(() => {
    const fetchAppointmentTime = async () => {
      try {
        const response = await fetch(`/api/user/appointments/${id}/time-vote`);
        if (!response.ok)
          throw new Error("시간투표 리스트 불러오기를 실패했습니다.");

        const data = await response.json();
        const startDate = new Date(data.start_time);
        const endDate = new Date(data.end_time);

        const generatedDateList = getDateList(startDate, endDate);
        const generatedTimeList = getTimeList(
          startDate.getHours(),
          endDate.getHours()
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
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];

    // ✅ UTC 변환 제거 → 한국 시간 그대로 사용
    const current = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    while (current <= endDate) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, "0");
      const day = String(current.getDate()).padStart(2, "0");
      const dayOfWeek = daysOfWeek[current.getDay()]; // ✅ 현지 시간 요일 사용

      dates.push(`${year}-${month}-${day}-${dayOfWeek}`);

      // ✅ UTC가 아닌 현지 시간 기준으로 날짜 증가
      current.setDate(current.getDate() + 1);
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

  // ✅ 터치 이벤트
  const handleTouchStart = (
    event: React.TouchEvent,
    row: number,
    col: number
  ) => {
    isDragging.current = true;
    dragValue.current = !gridSelected[row][col];

    // ✅ 기존 timeout이 있다면 클리어
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
    }

    // ✅ 터치 후 100ms 내에 `touchmove`가 발생하지 않으면 단일 선택 적용
    touchTimeout.current = setTimeout(() => {
      if (isDragging.current) {
        toggleCell(row, col);
        lastTouchedCell.current = { row, col };
      }
    }, 100);
  };

  // ✅ 터치 이동 시 여러 셀을 선택하도록 개선
  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging.current) return;

    // ✅ 단순한 터치라면 `setTimeout` 해제 (즉, 드래그로 간주)
    if (touchTimeout.current) {
      clearTimeout(touchTimeout.current);
      touchTimeout.current = null;
    }

    const touch = event.touches[0];
    const target = document.elementFromPoint(
      touch.clientX,
      touch.clientY
    ) as HTMLElement;

    if (target && target.dataset.row && target.dataset.col) {
      const touchRow = parseInt(target.dataset.row);
      const touchCol = parseInt(target.dataset.col);

      if (
        !lastTouchedCell.current ||
        lastTouchedCell.current.row !== touchRow ||
        lastTouchedCell.current.col !== touchCol
      ) {
        toggleCell(touchRow, touchCol, true);
        lastTouchedCell.current = { row: touchRow, col: touchCol };
      }
    }
  };

  const handleTouchEnd = () => {
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
    return <Loading />; // 데이터 로딩 전 UI
  }

  return (
    <div
      className={styles.timeVoteContainer}
      onMouseUp={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
    >
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
              onTouchMove={handleTouchMove}
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
                    onTouchStart={(event) =>
                      handleTouchStart(event, rowIndex, colIndex)
                    }
                    data-row={rowIndex}
                    data-col={colIndex}
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
    </div>
  );
};

export default VoteTimePage;
