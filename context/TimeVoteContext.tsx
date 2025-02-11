"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// ✅ Context 타입 정의
interface TimeVoteContextType {
  selectedTimes: string[];
  setSelectedTimes: (times: string[]) => void;
}

// ✅ Context 생성
const TimeVoteContext = createContext<TimeVoteContextType | undefined>(
  undefined
);

// ✅ Provider 컴포넌트 생성
export const TimeVoteProvider = ({ children }: { children: ReactNode }) => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  return (
    <TimeVoteContext.Provider value={{ selectedTimes, setSelectedTimes }}>
      {children}
    </TimeVoteContext.Provider>
  );
};

// ✅ Context를 쉽게 사용할 수 있도록 커스텀 훅 생성
export const useTimeVote = () => {
  const context = useContext(TimeVoteContext);
  if (!context) {
    throw new Error("useTimeVote must be used within a TimeVoteProvider");
  }
  return context;
};
