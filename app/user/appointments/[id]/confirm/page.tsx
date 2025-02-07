"use client";

import styles from "./confirm.module.scss";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar } from "react-date-range";
import Button from "@/components/button/Button";
import ArrowHeader from "@/components/header/ArrowHeader";
import Loading from "@/components/loading/Loading";
import { getUserIdClient } from "@/utils/supabase/client";

const ConfirmPage = () => {
  const router = useRouter();
  const params = useParams();
  const appointmentId = params.id as string;

  const [confirmTime, setConfirmTime] = useState("오전 9시");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [placeList, setPlaceList] = useState<
    { place: string; place_url: string | null }[]
  >([]);
  const [confirmPlace, setConfirmPlace] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);

  // 로그인 상태 확인
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getUserIdClient();
        if (!user) {
          alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("❌ 유저 정보 가져오기 실패:", error);
      }
    };
    fetchUserId();
  }, []);

  // ✅ 1. 장소 목록을 API에서 가져오기
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `/api/user/appointments/${appointmentId}/confirm`
        );
        const data = await response.json();

        if (response.ok) {
          setPlaceList(data); // ✅ API에서 받은 데이터를 그대로 저장
          setConfirmPlace(data[0]?.place || ""); // ✅ 기본 선택 값 설정
        } else {
          alert(
            `❌ 장소 데이터를 불러오는 중 오류 발생: ${
              data.error || "알 수 없는 오류"
            }`
          );
        }
      } catch (error) {
        console.error("❌ 장소 목록 불러오기 실패:", error);
      }
    };

    fetchPlaces();
  }, [appointmentId]);

  // ✅ 2. 사용자가 입력한 값 설정
  const handleDateChange = (date: Date) => setSelectedDate(date);
  const handleConfirmTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setConfirmTime(event.target.value);
  const handleConfirmPlaceChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => setConfirmPlace(event.target.value);

  // ✅ 3. 모달 열기
  const handleNextButton = () => setModalOpen(true);

  // ✅ 4. API 호출 후 약속 확정 저장
  const handleConfirm = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식

      // ✅ '오전 9시' → '09:00:00', '오후 5시' → '17:00:00' 변환
      const convertTo24HourFormat = (time: string): string => {
        const isPM = time.includes("오후");
        let hour = parseInt(time.replace(/(오전|오후|\s시)/g, ""), 10);

        if (isPM && hour !== 12) {
          hour += 12; // 오후일 경우 12 추가
        } else if (!isPM && hour === 12) {
          hour = 0; // 오전 12시는 00:00으로 변환
        }

        return `${String(hour).padStart(2, "0")}:00:00`; // HH:mm:ss 형식
      };

      const formattedTime = convertTo24HourFormat(confirmTime);

      // ✅ 날짜와 시간을 합쳐서 confirm_time 생성 (YYYY-MM-DD HH:mm:ss)
      const confirmDateTime = `${formattedDate} ${formattedTime}`;

      // ✅ 선택한 장소에서 place_url 가져오기 (없을 수도 있음)
      const selectedPlace = placeList.find((p) => p.place === confirmPlace);
      const confirmPlaceUrl = selectedPlace?.place_url || null; // ✅ 없으면 null

      const response = await fetch(
        `/api/user/appointments/${appointmentId}/confirm`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            confirm_time: confirmDateTime, // ✅ 날짜 + 24시간제 시간
            confirm_place: confirmPlace, // ✅ 사용자가 선택한 장소 그대로 전송
            confirm_place_url: confirmPlaceUrl, // ✅ 장소 URL (없을 경우 null)
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        router.push(`/user/appointments/${appointmentId}/confirm/complete`);
      } else {
        alert(`❌ 약속 확정 실패: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("❌ 약속 확정 API 요청 실패:", error);
    }
  };

  if (!placeList.length) {
    return <Loading />; // 데이터 로딩 전 UI
  }

  return (
    <div className={styles.container}>
      <ArrowHeader />
      <section className={styles.mainBox}>
        <div className={styles.datePickerWrapper}>
          <p className={styles.title}>약속 확정하기</p>
          <p>확정 일자</p>
          <Calendar
            date={selectedDate}
            onChange={handleDateChange}
            color="#6c63ff"
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
              {placeList.map((placeObj, index) => (
                <option key={index} value={placeObj.place}>
                  {placeObj.place}
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
