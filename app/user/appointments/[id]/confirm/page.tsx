"use client";

import styles from "./confirm.module.scss";
import { useState } from "react";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import Button from "@/components/button/Button";
import { useRouter } from "next/navigation";

const ConfirmPage = () => {
  const router = useRouter();

  const [confirmTime, setConfirmTime] = useState("오전 9시");

  const initialStartDate = new Date();
  const initialEndDate = new Date();
  initialStartDate.setHours(timeTo24HourFormat(confirmTime), 0, 0, 0);

  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    },
  ]);

  const placeList = [
    "홍대입구",
    "서울역",
    "동대문역사문화공원역",
    "동대문역",
    "강남역",
  ];
  const [confirmPlace, setConfirmPlace] = useState(placeList[0]);

  const [isModalOpen, setModalOpen] = useState(false); // ✅ 모달 상태 추가

  const handleDateChange = (ranges: any) => {
    const range = ranges.selection;
    const differenceInDays =
      (range.endDate - range.startDate) / (1000 * 60 * 60 * 24);
    if (differenceInDays <= 7) {
      setSelectedRange([range]);
    } else {
      alert("최대 7일까지 선택할 수 있습니다.");
    }
  };

  const handleConfirmTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTime = event.target.value;
    setConfirmTime(selectedTime);

    const updatedRange = { ...selectedRange[0] };
    const startHour = timeTo24HourFormat(selectedTime);
    updatedRange.startDate.setHours(startHour, 0, 0, 0); // 분, 초, 밀리초는 0으로 설정
    setSelectedRange([updatedRange]);
  };
  const handleConfirmPlaceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedPlace = event.target.value;
    setConfirmPlace(selectedPlace);
  };

  // "약속 확정하기" 버튼 클릭 시 모달 열기
  const handleNextButton = () => {
    setModalOpen(true);
  };

  // "확인" 버튼 클릭 시 `/user/appointments`로 이동
  const handleConfirm = () => {
    setModalOpen(false);
    router.push("/user/appointments");
  };
  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.datePickerWrapper}>
          <p className={styles.title}>약속 확정하기</p>
          <p>확정 일자</p>

          <DateRange
            ranges={selectedRange}
            onChange={handleDateChange}
            rangeColors={["#6c63ff"]}
            minDate={new Date()}
          />
        </div>

        <div className={styles.timeSelectWrapper}>
          <p>확정 시간 선택</p>
          <div className={styles.timePicker}>
            <select value={confirmTime} onChange={handleConfirmTimeChange}>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <span>까지 모이기</span>
          </div>
        </div>

        <div className={styles.placeSelectWrapper}>
          <p>확정 장소 선택</p>
          <div className={styles.placePicker}>
            <select value={confirmPlace} onChange={handleConfirmPlaceChange}>
              {placeList.map((place, index) => (
                <option key={index} value={place}>
                  {place}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.wrapButton}>
          <Button text="약속 확정하기" size="lg" onClick={handleNextButton} />
        </div>
      </section>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalTitle}>약속을 확정하시겠습니까?</p>
            <div className={styles.modalContents}>
              <p>
                📅 일자: {selectedRange[0].startDate.toLocaleDateString()}~
                {selectedRange[0].endDate.toLocaleDateString()}
              </p>
              <p>⏰ 시간: {confirmTime}</p>
              <p>📍 장소: {confirmPlace}</p>
            </div>
            <div className={styles.modalButtons}>
              <button
                className={styles.cancel}
                onClick={() => setModalOpen(false)}
              >
                취소
              </button>
              <button className={styles.confirm} onClick={handleConfirm}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmPage;

const times = [
  "오전 12시",
  "오전 1시",
  "오전 2시",
  "오전 3시",
  "오전 4시",
  "오전 5시",
  "오전 6시",
  "오전 7시",
  "오전 8시",
  "오전 9시",
  "오전 10시",
  "오전 11시",
  "오후 12시",
  "오후 1시",
  "오후 2시",
  "오후 3시",
  "오후 4시",
  "오후 5시",
  "오후 6시",
  "오후 7시",
  "오후 8시",
  "오후 9시",
  "오후 10시",
  "오후 11시",
];

// util.ts
const timeTo24HourFormat = (time: string): number => {
  const [period, hour] = time.split(" ");
  let formattedHour = parseInt(hour.replace("시", ""));
  if (period === "오후" && formattedHour !== 12) {
    formattedHour += 12;
  }
  if (period === "오전" && formattedHour === 12) {
    formattedHour = 0;
  }
  return formattedHour;
};
