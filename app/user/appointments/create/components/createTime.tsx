"use client";

import styles from "./createTime.module.scss";
import useCreateTime from "../hooks/useCreateTime";
import CircleIndicator from "./CircleIndicator";
import Button from "@/components/button/Button";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Props {
  onPageChange: (index: number) => void;
}

const CreateTime: React.FC<Props> = ({ onPageChange }) => {
  const {
    times,
    hooks: { startTime, endTime, selectedRange },
    handlers: {
      handleDateChange,
      handleStartTimeChange,
      handleEndTimeChange,
      handleNextButton,
    },
  } = useCreateTime(onPageChange);

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
