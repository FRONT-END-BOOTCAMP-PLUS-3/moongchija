"use client";
import Button from "@/components/button/Button";
import styles from "./voteResult.module.scss";
import TimeResult from "./components/TimeResult";
import PlaceResult from "./components/PlaceResult";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArrowHeader from "@/components/header/ArrowHeader";
import { getUserIdClient } from "@/utils/supabase/client";

interface TimeVoteResult {
  start_time: string | null;
  end_time: string | null;
  member: string[]; // 전체 멤버 ID 목록
  result: {
    date: string; // 투표한 날짜 및 시간
    user: string[]; // 해당 시간에 투표한 유저 ID 목록
  }[];
}

interface PlaceVoteResult {
  member: string[]; // 전체 멤버 ID 목록
  result: {
    place: string; // 장소 이름
    place_url: string; // 장소 URL
    user: string[]; // 해당 장소에 투표한 유저 ID 목록
  }[];
}

interface VoteResultType {
  ownerId: string;
  time: TimeVoteResult;
  place: PlaceVoteResult;
}

const VoteResultPage = () => {
  const router = useRouter(); // useRouter 훅 사용 -> router.push로 페이지 이동을위해 사용
  const params = useParams(); // URL에서 ID 추출
  const id = params.id as string; // ID값 추출
  const [page, setPage] = useState(1);

  const [resultData, setResultData] = useState<VoteResultType | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ API 호출하여 투표 결과 가져오기
  useEffect(() => {
    if (!id) return;

    const fetchVoteResult = async () => {
      try {
        const response = await fetch(
          `/api/user/appointments/${id}/vote-result`
        );
        if (!response.ok)
          throw new Error("❌ 투표 결과를 가져오는 데 실패했습니다.");

        const data = await response.json();
        console.log("📌 [DEBUG] API에서 받은 투표 결과:", data); // ✅ 응답 확인
        setResultData(data);
      } catch (error) {
        console.error("❌ [ERROR] 투표 결과 로드 실패:", error);
      }
    };

    fetchVoteResult();
  }, [id]);
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await getUserIdClient();
        if (!user) {
          alert("❌ 로그인이 필요합니다. 로그인 페이지로 이동합니다.");
          router.push("/login");
          return;
        }
        setUserId(user);
      } catch (error) {
        console.error("❌ 유저 정보 가져오기 실패:", error);
      }
    };
    fetchUserId();
  }, []);

  if (!resultData) return <p>로딩 중...</p>;

  return (
    <div className={styles.voteResultContainer}>
      <ArrowHeader />
      <div className={styles.mainBox}>
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
          <TimeResult
            timeProps={{
              ...resultData!.time,
              start_time: resultData!.time.start_time ?? "",
              end_time: resultData!.time.end_time ?? "",
            }}
          />
        ) : (
          <PlaceResult placeProps={resultData!.place} />
        )}

        <div className={styles.wrapButton}>
          {resultData.ownerId === userId ? (
            <Button
              text="약속 확정하러 가기"
              size="lg"
              onClick={() => router.push(`/user/appointments/${id}/confirm`)}
            />
          ) : (
            <Button
              text="홈으로 가기"
              size="lg"
              onClick={() => router.push(`/user/appointments`)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteResultPage;
