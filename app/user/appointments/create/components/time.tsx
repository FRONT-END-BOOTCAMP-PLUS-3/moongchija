"use client";

import styles from "./time.module.scss";
import Button from "@/components/button/Button";
import { useState } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";
import { formatToISOStringWithKST } from "@/utils/dateUtils/dateUtils";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CircleIndicator from "./CircleIndicator";

interface Props {
  onPageChange: (index: number) => void;
}

const CreateTime: React.FC<Props> = ({ onPageChange }) => {
  const { setAppointment } = useCreateAppointment();

  const [startTime, setStartTime] = useState<number>(9);
  const [endTime, setEndTime] = useState<number>(15);

  const today = new Date();
  const initialStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0);
  const initialEndDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0);
  
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
      setSelectedRange([
        {
          startDate: new Date(
            range.startDate.setHours(
              selectedRange[0].startDate.getHours(),
              selectedRange[0].startDate.getMinutes(),
              selectedRange[0].startDate.getSeconds(),
              selectedRange[0].startDate.getMilliseconds()
            )
          ),
          endDate: new Date(
            range.endDate.setHours(
              selectedRange[0].endDate.getHours(),
              selectedRange[0].endDate.getMinutes(),
              selectedRange[0].endDate.getSeconds(),
              selectedRange[0].endDate.getMilliseconds()
            )
          ),
          key: "selection",
        },
      ]);
    } else {
      alert("최대 7일까지 선택할 수 있습니다.");
    }
  };

  const handleStartTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedTime = Number(event.target.value);
  
    if (selectedTime >= endTime) {
      alert("시작 시간은 종료 시간보다 이전이어야 합니다.");
      setStartTime(startTime);
      return;
    }
  
    setStartTime(selectedTime);
  
    const updatedRange = { ...selectedRange[0] };
    updatedRange.startDate.setHours(selectedTime, 0, 0, 0);
    setSelectedRange([updatedRange]);
  };
  
  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = Number(event.target.value);
  
    if (selectedTime <= startTime) {
      alert("종료 시간은 시작 시간보다 이후여야 합니다.");
      setEndTime(endTime);
      return;
    }
  
    setEndTime(selectedTime);
  
    const updatedRange = { ...selectedRange[0] };
    updatedRange.endDate.setHours(selectedTime, 0, 0, 0);
    setSelectedRange([updatedRange]);
  };

  const handleNextButton = () => {
    setAppointment((prev) => ({
      ...prev,
      start_time: formatToISOStringWithKST(selectedRange[0].startDate),
      end_time: formatToISOStringWithKST(selectedRange[0].endDate),
    }));

    onPageChange(3);
  };

  return (
    <div className={styles.container}>
      <section className={styles.mainBox}>
        <div className={styles.indicatorWrapper}>
          <CircleIndicator total={3} activeIndexs={[0, 1]} />
        </div>

        <div className={styles.datePickerWrapper}>
          <p>기간 선택</p>
          <span className={styles.message}>
            최대 7일까지 선택할 수 있습니다.
          </span>
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
              {Object.entries(times).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
            <span>부터</span>
            <select value={endTime} onChange={handleEndTimeChange}>
              {Object.entries(times).map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
            </select>
            <span>까지</span>
          </div>
        </div>
      </section>

      <div className={styles.buttonWrapper}>
        <Button size="lg" text="다음" onClick={handleNextButton} />
      </div>
    </div>
  );
};

export default CreateTime;

const times: { [key: string]: number } = {
  "오전 12시": 0,
  "오전 1시": 1,
  "오전 2시": 2,
  "오전 3시": 3,
  "오전 4시": 4,
  "오전 5시": 5,
  "오전 6시": 6,
  "오전 7시": 7,
  "오전 8시": 8,
  "오전 9시": 9,
  "오전 10시": 10,
  "오전 11시": 11,
  "오후 12시": 12,
  "오후 1시": 13,
  "오후 2시": 14,
  "오후 3시": 15,
  "오후 4시": 16,
  "오후 5시": 17,
  "오후 6시": 18,
  "오후 7시": 19,
  "오후 8시": 20,
  "오후 9시": 21,
  "오후 10시": 22,
  "오후 11시": 23,
};
