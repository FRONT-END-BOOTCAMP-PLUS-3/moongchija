
const getFormattedDateParts = (date: Date) => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayName = dayNames[date.getDay()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    return { year, month, day, dayName, hours, minutes };
  };
  
  export const formatDate = (date: Date): string => {
    const { year, month, day, dayName } = getFormattedDateParts(date);
    return `${year}.${month}.${day}(${dayName})`;
  };
  
  export const formatTime = (date: Date): string => {
    const { year, month, day, dayName, hours, minutes } =
      getFormattedDateParts(date);
    return `${year}.${month}.${day}(${dayName}) ${hours}:${minutes}`;
  };
  
  export const calculateCountdown = (startDate: Date): string => {
    const today = new Date();
    const timeDiff = startDate.getTime() - today.getTime(); // 시간 차이 (밀리초)
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 밀리초 -> 일 단위로 변환
  
    if (daysLeft < 0) return "종료"; // 이미 지난 날짜
    if (daysLeft === 0) return "D-Day"; // 당일
    return `D-${daysLeft}`;
  };