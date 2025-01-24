"use client";

import styles from "./vote.module.scss";
import TimeVotePage from "./_components/TimeVote";
import PlaceVote from "./_components/PlaceVote";
import { useState } from "react";

interface VoteRange {
  start_time: string; // "2025-01-02 12:00:00"
  end_time: string; // "2025-01-10 22:00:00"
  places: { place: string; place_url: string }[];
}

const VotePage = () => {
  const voteRange: VoteRange = {
    start_time: "2025-01-01 00:00:00",
    end_time: "2025-01-07 23:00:00",
    places: [
      { place: "홍대입구", place_url: "https://naver.me/xEABuNEP" },
      { place: "서울역", place_url: "https://naver.me/xEABuNEP" },
      { place: "동대문", place_url: "https://naver.me/xEABuNEP" },
      { place: "동역사", place_url: "https://naver.me/xEABuNEP" },
      { place: "가나다", place_url: "https://naver.me/xEABuNEP" },
    ],
  };

  const [step, setStep] = useState<number>(1); // 1: 시간 선택, 2: 장소 선택
  const [selectedData, setSelectedData] = useState<{
    times: string[];
    place: string | null;
  }>({
    times: [], // 사용자가 선택한 시간 목록
    place: null, // 사용자가 선택한 장소
  });

  const handleTimeSelection = (times: string[]) => {
    setSelectedData((prev) => ({ ...prev, times })); // 선택한 시간 저장
    setStep(2); // 장소 선택 단계로 이동
  };

  const handlePlaceSelection = (place: string) => {
    setSelectedData((prev) => ({ ...prev, place })); // 선택한 장소 저장
    alert(`최종 선택 데이터: ${JSON.stringify({ ...selectedData, place })}`);
    // 이곳에 나중에 투표완료 API추가
  };
  return (
    <div className={styles.voteContainer}>
      {step === 1 && (
        <TimeVotePage
          voteTimes={{
            start_time: voteRange.start_time,
            end_time: voteRange.end_time,
          }}
          onTimeSelect={handleTimeSelection}
        />
      )}
      {step === 2 && (
        <PlaceVote
          votePlaces={voteRange.places}
          onPlaceSelect={handlePlaceSelection}
        />
      )}
    </div>
  );
};

export default VotePage;
