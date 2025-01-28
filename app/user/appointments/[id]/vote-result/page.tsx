"use client";
import Button from "@/components/button/Button";
import styles from "./voteResult.module.scss";
import TimeResult from "./components/TimeResult";
import PlaceResult from "./components/PlaceResult";
import { useState } from "react";

interface Place {
  member: string[];
  result: {
    place: string;
    place_url: string;
    user: string[];
  }[];
}
interface Time {
  start_time: string;
  end_time: string;
  member: string[];
  result: {
    date: string;
    user: string[];
  }[];
}

const VoteResultPage = () => {
  const [page, setPage] = useState(1);

  const [resultData, setResultData] = useState({
    time: {
      start_time: "2025-01-01 12:00:00",
      end_time: "2025-01-07 22:00:00",
      member: ["고뭉치", "김뭉치", "심뭉치", "이뭉치", "황뭉치", "빈뭉치"],
      result: [
        { date: "2025-01-01 12:00:00", user: [] },
        { date: "2025-01-01 13:00:00", user: ["고뭉치"] },
        { date: "2025-01-01 14:00:00", user: ["고뭉치", "심뭉치"] },
        { date: "2025-01-01 15:00:00", user: ["고뭉치", "김뭉치", "심뭉치"] },
        {
          date: "2025-01-01 16:00:00",
          user: ["고뭉치", "김뭉치", "심뭉치", "이뭉치"],
        },
      ],
    },
    place: {
      member: [
        "고뭉치",
        "김뭉치",
        "심뭉치",
        "이뭉치",
        "황뭉치",
        "빈뭉치",
        "가뭉치",
        "나뭉치",
      ],
      result: [
        {
          place: "동대문역사문화공원역",
          place_url: "https://naver.me/xEABuNEP",
          user: ["고뭉치", "김뭉치", "심뭉치"],
        },
        {
          place: "홍대입구",
          place_url: "https://naver.me/xEABuNEP",
          user: ["김뭉치", "심뭉치"],
        },
        {
          place: "서울역",
          place_url: "https://naver.me/xEABuNEP",
          user: ["심뭉치"],
        },
        { place: "우리집", place_url: "https://naver.me/xEABuNEP", user: [] },
        {
          place: "롯데월드",
          place_url: "https://naver.me/xEABuNEP",
          user: [
            "고뭉치",
            "김뭉치",
            "심뭉치",
            "이뭉치",
            "황뭉치",
            "빈뭉치",
            "가뭉치",
            "나뭉치",
          ],
        },
      ],
    },
  });
  return (
    <div className={styles.voteResultContainer}>
      <p className={styles.subtitle}>
        현재까지{" "}
        <span style={{ color: "red" }}>{resultData.time.member.length}</span>{" "}
        명의 {page === 1 ? "시간" : "장소"} 조율 결과예요
      </p>
      <div className={styles.wrapTapButton}>
        <div className={styles.tapButton}>
          <button
            className={`${styles.timeButton} ${
              page === 1 ? styles.selected : ""
            }`}
            onClick={() => setPage(1)}
          >
            시간
          </button>
          <button
            className={`${styles.placeButton} ${
              page === 2 ? styles.selected : ""
            }`}
            onClick={() => setPage(2)}
          >
            장소
          </button>
        </div>
      </div>
      {page === 1 ? (
        <TimeResult timeProps={resultData.time} />
      ) : (
        <PlaceResult placeProps={resultData.place} />
      )}
      <div className={styles.wrapButton}>
        <Button text="약속 확정하러 가기" size="lg" />
      </div>
    </div>
  );
};

export default VoteResultPage;
