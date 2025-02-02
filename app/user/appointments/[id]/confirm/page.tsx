"use client";

import styles from "./confirm.module.scss";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "react-date-range"; // ✅ Calendar 컴포넌트 사용 (단일 날짜 선택)
import Button from "@/components/button/Button";
import ArrowHeader from "@/components/header/ArrowHeader";

const ConfirmPage = () => {
  const router = useRouter();
  const params = useParams(); // URL에서 ID 추출
  const appointmentId = params.id as string; // ID값 추출

  const [confirmTime, setConfirmTime] = useState("오전 9시");
  const [selectedDate, setSelectedDate] = useState(new Date()); // ✅ 단일 날짜 선택

  const placeList = [
    "홍대입구",
    "서울역",
    "동대문역사문화공원역",
    "동대문역",
    "강남역",
  ];
  const [confirmPlace, setConfirmPlace] = useState(placeList[0]);

  const [isModalOpen, setModalOpen] = useState(false); // ✅ 모달 상태 추가

  const handleDateChange = (date: Date) => {
    setSelectedDate(date); // ✅ 단일 날짜 선택
  };

  const handleConfirmTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setConfirmTime(event.target.value);
  };

  const handleConfirmPlaceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setConfirmPlace(event.target.value);
  };

  // "약속 확정하기" 버튼 클릭 시 모달 열기
  const handleNextButton = () => {
    setModalOpen(true);
  };

  // "확인" 버튼 클릭 시 `/user/appointments/[id]/confirm/complete`로 이동
  const handleConfirm = () => {
    setModalOpen(false);
    router.push(`/user/appointments/${appointmentId}/confirm/complete`);
  };

  return (
    <div className={styles.container}>
      <ArrowHeader />
      <section className={styles.mainBox}>
        <div className={styles.datePickerWrapper}>
          <p className={styles.title}>약속 확정하기</p>
          <p>확정 일자</p>

          {/* ✅ 하루만 선택할 수 있는 Calendar */}
          <Calendar
            date={selectedDate}
            onChange={handleDateChange}
            color="#6c63ff"
            minDate={new Date()} // 오늘 이후 날짜만 선택 가능
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

      {/* ✅ 모달 구현 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <p className={styles.modalTitle}>약속을 확정하시겠습니까?</p>
            <div className={styles.modalContents}>
              <p>📅 일자: {selectedDate.toLocaleDateString()}</p>
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
