"use client";

import styles from "./time.module.scss";
import { useState } from "react";
import CircleIndicator from "../components/CircleIndicator";
import Button from "@/components/button/Button";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";

const CreateTimePage = () => {
  const [startTime, setStartTime] = useState("오전 9시");
  const [endTime, setEndTime] = useState("오후 3시");

  const initialStartDate = new Date();
  const initialEndDate = new Date();
  initialStartDate.setHours(timeTo24HourFormat(startTime), 0, 0, 0);
  initialEndDate.setHours(timeTo24HourFormat(endTime), 0, 0, 0);

  const [selectedRange, setSelectedRange] = useState([
    {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    },
  ]);

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

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTime = event.target.value;
    setStartTime(selectedTime);

    const updatedRange = { ...selectedRange[0] };
    const startHour = timeTo24HourFormat(selectedTime);
    updatedRange.startDate.setHours(startHour, 0, 0, 0); // 분, 초, 밀리초는 0으로 설정
    setSelectedRange([updatedRange]);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = event.target.value;
    setEndTime(selectedTime);

    const updatedRange = { ...selectedRange[0] };
    const endHour = timeTo24HourFormat(selectedTime);
    updatedRange.endDate.setHours(endHour, 0, 0, 0); // 분, 초, 밀리초는 0으로 설정
    setSelectedRange([updatedRange]);
  };

  const handleNextButton = () => {
    console.log("Start Time:", selectedRange[0].startDate);
    console.log("End Time:", selectedRange[0].endDate);
    window.location.href = "/user/appointments/create/place";
  };

  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.indicatorWrapper}>
          <CircleIndicator total={3} activeIndexs={[0, 1]} />
        </div>

        <div className={styles.datePickerWrapper}>
          <p>기간 선택</p>
          <p>최대 7일까지 선택할 수 있습니다.</p>
          <DateRange
            ranges={selectedRange}
            onChange={handleDateChange}
            rangeColors={["#6c63ff"]}
            minDate={new Date()}
          />
        </div>

        <div className={styles.timeSelectWrapper}>
          <p>시간 선택</p>
          <div className={styles.timePicker}>
            <select value={startTime} onChange={handleStartTimeChange}>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <span>부터</span>
            <select value={endTime} onChange={handleEndTimeChange}>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <span>까지</span>
          </div>
        </div>
      </section>

      <Button size="lg" text="다음" onClick={handleNextButton} />
    </div>
  );
};

export default CreateTimePage;

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
