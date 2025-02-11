import { useState } from "react";
import { useCreateAppointment } from "@/context/CreateAppointmentContext";
import { formatToISOStringWithKST } from "@/utils/dateUtils/dateUtils";
import { RangeKeyDict } from "react-date-range";

const MAX_DAYS = 7;

const useCreateTime = (onPageChange: (index: number) => void) => {
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

  // 날짜 변경 핸들러 (최대 7일까지 제한)
  const handleDateChange = (rangesByKey: RangeKeyDict) => {
    const range = rangesByKey.selection;
  
    if (range && range.startDate && range.endDate) {
      const differenceInDays = (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24);
  
      if (differenceInDays <= MAX_DAYS) {
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
    }
  };  

  // 시작 시간 변경 핸들러
  const handleStartTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = Number(event.target.value);
    if (selectedTime >= endTime) {
      alert("시작 시간은 종료 시간보다 이전이어야 합니다.");
      return;
    }
    setStartTime(selectedTime);
    setSelectedRange([{ ...selectedRange[0], startDate: new Date(selectedRange[0].startDate.setHours(selectedTime)) }]);
  };

  // 종료 시간 변경 핸들러
  const handleEndTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTime = Number(event.target.value);
    if (selectedTime <= startTime) {
      alert("종료 시간은 시작 시간보다 이후여야 합니다.");
      return;
    }
    setEndTime(selectedTime);
    setSelectedRange([{ ...selectedRange[0], endDate: new Date(selectedRange[0].endDate.setHours(selectedTime)) }]);
  };

  // 다음 버튼 클릭 시 약속 정보 저장 후 페이지 이동
  const handleNextButton = () => {
    setAppointment((prev) => ({
      ...prev,
      start_time: formatToISOStringWithKST(selectedRange[0].startDate),
      end_time: formatToISOStringWithKST(selectedRange[0].endDate),
    }));
    onPageChange(3);
  };

  return {
    times,
    hooks: {
      startTime,
      endTime,
      selectedRange,
    },
    handlers: {
      handleDateChange,
      handleStartTimeChange,
      handleEndTimeChange,
      handleNextButton,
    },
  };
};

export default useCreateTime;

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
